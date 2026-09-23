import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { ResumeData, ResumeSettings } from '@/app/types/resume';
import { formatResumeDate } from '@/app/utils/resumeDate';

export const ResumePdfDocument = ({ data, settings }: { data: ResumeData; settings: ResumeSettings }) => {
  const { personalData, summary, experiences, education, skills, languages, certifications, projects, courses } = data;
  const color = settings.primaryColor || '#2563eb';
  const isModern = settings.template === 'modern';
  const isClassic = settings.template === 'classic';
  const sectionIsVisible = (section: keyof ResumeSettings['showSections']) =>
    settings.showSections[section] !== false;
  const styles = StyleSheet.create({
    page: {
      padding: isModern ? 0 : 34,
      fontSize: 9,
      fontFamily: 'Helvetica',
      color: '#1f2937',
    },
    content: {     padding: isModern ? 28 : 0 },
    header: {
      paddingBottom: 12,
      marginBottom: 14,
      borderBottomWidth: isClassic ? 1 : 3,
      borderBottomColor: color,
      backgroundColor: isModern ? `${color}12` : '#ffffff',
      padding: isModern ? 18 : 0,
    },
    name: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#111827' },
    profession: { fontSize: 11, color: '#4b5563', marginTop: 4, marginBottom: 7 },
    contact: { fontSize: 8, color: '#4b5563', lineHeight: 1.35 },
    section: { marginBottom: 11 },
    sectionTitle: {
      fontSize: 10,
      fontFamily: 'Helvetica-Bold',
      color,
      marginBottom: 5,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottomWidth: isClassic ? 0 : 1,
      borderBottomColor: `${color}55`,
      paddingBottom: 3,
    },
    item: { marginBottom: 7, paddingLeft: isModern ? 0 : 8, borderLeftWidth: isModern ? 0 : 2, borderLeftColor: color },
    itemTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111827' },
    itemMeta: { fontSize: 8, color: '#4b5563', marginTop: 2, marginBottom: 3 },
    body: { fontSize: 9, color: '#374151', lineHeight: 1.3 },
    skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
    skill: {
      fontSize: 8,
      color: isModern ? '#ffffff' : color,
      backgroundColor: isModern ? color : `${color}18`,
      paddingVertical: 3,
      paddingHorizontal: 6,
      borderRadius: 10,
    },
    languages: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    language: { fontSize: 9, color: '#374151' },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{personalData.fullName || 'Seu Nome'}</Text>
            {personalData.profession ? <Text style={styles.profession}>{personalData.profession}</Text> : null}
            <Text style={styles.contact}>
              {[personalData.email, personalData.phone, personalData.address, personalData.linkedin, personalData.website]
                .filter(Boolean)
                .join('  •  ')}
            </Text>
          </View>

          {sectionIsVisible('summary') && summary ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumo Profissional</Text>
              <Text style={styles.body}>{summary}</Text>
            </View>
          ) : null}

          {sectionIsVisible('experience') && experiences.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experiência Profissional</Text>
              {experiences.map((e) => (
                <View key={e.id} style={styles.item}>
                  <Text style={styles.itemTitle}>{e.title}</Text>
                  <Text style={styles.itemMeta}>
                    {e.company}  •  {e.location}  •  {formatResumeDate(e.startDate)} - {e.current ? 'Presente' : formatResumeDate(e.endDate)}
                  </Text>
                  {e.description ? <Text style={styles.body}>{e.description}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}

          {sectionIsVisible('education') && education.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Formação Acadêmica</Text>
              {education.map((ed) => (
                <View key={ed.id} style={styles.item}>
                  <Text style={styles.itemTitle}>{ed.degree}</Text>
                  <Text style={styles.itemMeta}>
                    {ed.institution}  •  {ed.location}  •  {formatResumeDate(ed.startDate)} - {ed.current ? 'Presente' : formatResumeDate(ed.endDate)}
                  </Text>
                  {ed.description ? <Text style={styles.body}>{ed.description}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}

          {sectionIsVisible('skills') && skills.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Competências</Text>
              <View style={styles.skills}>
                {skills.map((skill) => <Text key={skill} style={styles.skill}>{skill}</Text>)}
              </View>
            </View>
          ) : null}

          {sectionIsVisible('languages') && languages.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Idiomas</Text>
              <View style={styles.languages}>
                {languages.map((language) => (
                  <Text key={language.language} style={styles.language}>
                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>{language.language}</Text>
                    {`  •  ${language.level}`}
                  </Text>
                ))}
              </View>
            </View>
          ) : null}
          {[
            ['certifications', 'Certificações', certifications],
            ['projects', 'Projectos relevantes', projects],
            ['courses', 'Cursos e formação complementar', courses],
          ].map(([key, title, items]) => sectionIsVisible(key as keyof ResumeSettings['showSections']) && (items as string[]).length > 0 ? (
            <View key={key as string} style={styles.section}>
              <Text style={styles.sectionTitle}>{title as string}</Text>
              {(items as string[]).map((item) => <Text key={item} style={styles.body}>• {item}</Text>)}
            </View>
          ) : null)}
        </View>
      </Page>
    </Document>
  );
};

export async function generatePdfBlob(data: ResumeData, settings: ResumeSettings) {
  const doc = <ResumePdfDocument data={data} settings={settings} />;
  return pdf(doc).toBlob();
}

export default ResumePdfDocument;
