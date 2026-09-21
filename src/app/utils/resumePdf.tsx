import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { ResumeData, ResumeSettings } from '@/app/types/resume';

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11, fontFamily: 'Helvetica' },
  header: { marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 'bold' },
  profession: { fontSize: 12, color: '#444', marginBottom: 8 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginTop: 8, marginBottom: 4 },
  small: { fontSize: 10, color: '#444' },
  item: { marginBottom: 6 },
});

export const ResumePdfDocument = ({ data, settings }: { data: ResumeData; settings: ResumeSettings }) => {
  const { personalData, summary, experiences, education, skills, languages } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalData.fullName || 'Seu Nome'}</Text>
          {personalData.profession ? <Text style={styles.profession}>{personalData.profession}</Text> : null}
          <Text style={styles.small}>{[personalData.email, personalData.phone, personalData.website].filter(Boolean).join(' • ')}</Text>
        </View>

        {summary ? (
          <View>
            <Text style={styles.sectionTitle}>Resumo</Text>
            <Text style={styles.item}>{summary}</Text>
          </View>
        ) : null}

        {experiences && experiences.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Experiência</Text>
            {experiences.map((e) => (
              <View key={e.id} style={styles.item}>
                <Text style={{ fontWeight: 'bold' }}>{e.title} — {e.company}</Text>
                <Text style={styles.small}>{e.startDate} — {e.current ? 'Presente' : e.endDate} • {e.location}</Text>
                {e.description ? <Text>{e.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {education && education.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Formação</Text>
            {education.map((ed) => (
              <View key={ed.id} style={styles.item}>
                <Text style={{ fontWeight: 'bold' }}>{ed.degree} — {ed.institution}</Text>
                <Text style={styles.small}>{ed.startDate} — {ed.current ? 'Presente' : ed.endDate} • {ed.location}</Text>
                {ed.description ? <Text>{ed.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {skills && skills.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Competências</Text>
            <Text style={styles.item}>{skills.join(', ')}</Text>
          </View>
        ) : null}

        {languages && languages.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Idiomas</Text>
            <Text style={styles.item}>{languages.map((l) => `${l.language} (${l.level})`).join(', ')}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
};

export async function generatePdfBlob(data: ResumeData, settings: ResumeSettings) {
  const doc = <ResumePdfDocument data={data} settings={settings} />;
  const asPdf = pdf();
  asPdf.updateContainer(doc);
  const blob = await asPdf.toBlob();
  return blob;
}

export default ResumePdfDocument;
