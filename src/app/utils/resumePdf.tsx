import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import type { ResumeData, ResumeSettings } from '@/app/types/resume';
import { formatResumeDate } from '@/app/utils/resumeDate';

export const ResumePdfDocument = ({ data, settings }: { data: ResumeData; settings: ResumeSettings }) => {
  const { personalData, summary, experiences, education, skills, languages, certifications, projects, courses } = data;
  const color = settings.primaryColor || '#2563eb';
  const isModern = settings.template === 'modern' && !settings.atsMode;
  const isClassic = settings.template === 'classic';
  const isFunctional = settings.template === 'functional';
  const layout = settings.layout;
  const isPhotoSidebar = layout === 'photo-side' || (!layout && settings.photoLayout === 'side');
  const isPhotoCentered = layout === 'photo-centered' || (!layout && settings.photoLayout === 'center');
  const isCreative = layout === 'creative' || (!layout && isModern && !isPhotoCentered);
  const isFirstJob = layout === 'first-job';
  const hasSidebarLayout = isPhotoSidebar || isCreative;
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
    columns: { flexDirection: 'row', alignItems: 'stretch' },
    sidebar: { width: '34%', padding: 20, backgroundColor: color, color: '#ffffff' },
    mainColumn: { width: '66%', padding: 24 },
    centeredHeader: { alignItems: 'center', textAlign: 'center', borderBottomWidth: 3, borderBottomColor: color, paddingBottom: 16, marginBottom: 16 },
    centeredColumns: { flexDirection: 'row', gap: 18 },
    centeredMain: { width: '62%' },
    centeredAside: { width: '38%', paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: `${color}55` },
    header: {
      paddingBottom: 12,
      marginBottom: 14,
      borderBottomWidth: isClassic ? 1 : 3,
      borderBottomColor: color,
      backgroundColor: isModern ? `${color}12` : '#ffffff',
      padding: isModern ? 18 : 0,
    },
    headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    headerText: { flexGrow: 1, flexShrink: 1 },
    photoSide: { width: 68, height: 82, objectFit: 'cover', borderRadius: 4 },
    photoCenter: { width: 76, height: 76, objectFit: 'cover', borderRadius: 38, alignSelf: 'center', marginBottom: 8 },
    photoSidebar: { width: 94, height: 94, objectFit: 'cover', borderRadius: 47, alignSelf: 'center', marginBottom: 16, borderWidth: 3, borderColor: '#ffffff' },
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

  const renderContactText = (light = false) => (
    <Text style={[styles.contact, light ? { color: '#ffffff' } : {}]}>
      {[personalData.email, personalData.phone, personalData.address, personalData.linkedin, personalData.website].filter(Boolean).join('  •  ')}
    </Text>
  );
  const renderSummary = () => sectionIsVisible('summary') && summary ? <View style={styles.section}><Text style={styles.sectionTitle}>{hasSidebarLayout ? 'Perfil profissional' : 'Resumo Profissional'}</Text><Text style={styles.body}>{summary}</Text></View> : null;
  const renderExperience = () => sectionIsVisible('experience') && experiences.length > 0 ? <View style={styles.section}><Text style={styles.sectionTitle}>Experiência Profissional</Text>{experiences.map((item) => <View key={item.id} style={styles.item}><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.itemMeta}>{item.company}  •  {item.location}  •  {formatResumeDate(item.startDate)} - {item.current ? 'Presente' : formatResumeDate(item.endDate)}</Text>{item.description ? <Text style={styles.body}>{item.description}</Text> : null}</View>)}</View> : null;
  const renderEducation = () => sectionIsVisible('education') && education.length > 0 ? <View style={styles.section}><Text style={styles.sectionTitle}>Formação</Text>{education.map((item) => <View key={item.id} style={styles.item}><Text style={styles.itemTitle}>{item.degree}</Text><Text style={styles.itemMeta}>{item.institution}  •  {item.location}  •  {formatResumeDate(item.startDate)} - {item.current ? 'Presente' : formatResumeDate(item.endDate)}</Text>{item.description ? <Text style={styles.body}>{item.description}</Text> : null}</View>)}</View> : null;
  const renderSkills = (title = 'Competências', inverse = false) => sectionIsVisible('skills') && skills.length > 0 ? <View style={styles.section}><Text style={[styles.sectionTitle, inverse ? { color: '#ffffff', borderBottomColor: '#ffffff80' } : {}]}>{title}</Text><View style={styles.skills}>{skills.map((skill) => <Text key={skill} style={[styles.skill, inverse ? { color: color, backgroundColor: '#ffffff' } : {}]}>{skill}</Text>)}</View></View> : null;
  const renderLanguages = (inverse = false) => sectionIsVisible('languages') && languages.length > 0 ? <View style={styles.section}><Text style={[styles.sectionTitle, inverse ? { color: '#ffffff', borderBottomColor: '#ffffff80' } : {}]}>Idiomas</Text>{languages.map((language) => <Text key={language.language} style={[styles.language, inverse ? { color: '#ffffff' } : {}]}>{language.language}  •  {language.level}</Text>)}</View> : null;
  const renderExtras = (sectionKeys: Array<'certifications' | 'projects' | 'courses'>) => {
    const extraContent = { certifications, projects, courses };
    const extraTitles = { certifications: 'Certificações', projects: 'Projectos relevantes', courses: 'Cursos e formação complementar' };
    return sectionKeys.map((key) => sectionIsVisible(key) && extraContent[key].length > 0 ? <View key={key} style={styles.section}><Text style={styles.sectionTitle}>{extraTitles[key]}</Text>{extraContent[key].map((item) => <Text key={item} style={styles.body}>• {item}</Text>)}</View> : null);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          {isPhotoSidebar ? (
            <View style={styles.columns}>
              <View style={styles.sidebar}>
                {personalData.photo ? <Image src={personalData.photo} style={styles.photoSidebar} /> : <Text style={[styles.contact, { color: '#ffffff', textAlign: 'center', marginBottom: 16 }]}>Fotografia</Text>}
                <Text style={[styles.sectionTitle, { color: '#ffffff', borderBottomColor: '#ffffff80' }]}>Contactos</Text>{renderContactText(true)}
                {[renderSkills('Competências', true), renderLanguages(true), ...renderExtras(['certifications', 'courses'])]}
              </View>
              <View style={styles.mainColumn}>
                <View style={styles.header}><Text style={styles.name}>{personalData.fullName || 'Seu Nome'}</Text><Text style={[styles.profession, { color }]}>{personalData.profession}</Text></View>
                {[renderSummary(), renderExperience(), renderEducation(), ...renderExtras(['projects'])]}
              </View>
            </View>
          ) : isCreative ? (
            <View style={styles.columns}>
              <View style={styles.sidebar}>
                <Text style={[styles.sectionTitle, { color: '#ffffff', borderBottomColor: '#ffffff80' }]}>Contactos</Text>{renderContactText(true)}
                {[renderSkills('Competências', true), renderLanguages(true)]}
              </View>
              <View style={styles.mainColumn}>
                <View style={styles.header}><Text style={styles.name}>{personalData.fullName || 'Seu Nome'}</Text><Text style={[styles.profession, { color }]}>{personalData.profession}</Text></View>
                {[renderSummary(), renderExperience(), renderEducation(), ...renderExtras(['certifications', 'projects', 'courses'])]}
              </View>
            </View>
          ) : isPhotoCentered ? (
            <>
              <View style={styles.centeredHeader}>
                {personalData.photo ? <Image src={personalData.photo} style={styles.photoCenter} /> : <Text style={styles.contact}>Fotografia</Text>}
                <Text style={styles.name}>{personalData.fullName || 'Seu Nome'}</Text><Text style={[styles.profession, { color }]}>{personalData.profession}</Text>{renderContactText()}
              </View>
              {renderSummary()}
              <View style={styles.centeredColumns}><View style={styles.centeredMain}>{[renderExperience(), ...renderExtras(['projects', 'courses'])]}</View><View style={styles.centeredAside}>{[renderEducation(), renderSkills(), renderLanguages(), ...renderExtras(['certifications'])]}</View></View>
            </>
          ) : isFunctional ? (
            <>
              <View style={styles.header}><Text style={styles.name}>{personalData.fullName || 'Seu Nome'}</Text><Text style={styles.profession}>{personalData.profession}</Text>{renderContactText()}</View>
              {[renderSkills('Competências principais'), renderSummary(), renderExperience(), ...renderExtras(['projects']), renderEducation(), ...renderExtras(['certifications', 'courses']), renderLanguages()]}
            </>
          ) : isFirstJob ? (
            <>
              <View style={styles.header}><Text style={styles.name}>{personalData.fullName || 'Seu Nome'}</Text><Text style={styles.profession}>{personalData.profession}</Text>{renderContactText()}</View>
              {renderSummary()}
              <View style={styles.centeredColumns}><View style={styles.centeredMain}>{[renderEducation(), renderSkills(), ...renderExtras(['projects', 'courses'])]}</View><View style={styles.centeredAside}>{[renderExperience(), renderLanguages(), ...renderExtras(['certifications'])]}</View></View>
            </>
          ) : (
            <>
              <View style={styles.header}><Text style={styles.name}>{personalData.fullName || 'Seu Nome'}</Text><Text style={styles.profession}>{personalData.profession}</Text>{renderContactText()}</View>
              {[renderSummary(), renderExperience(), renderEducation(), renderSkills(), renderLanguages(), ...renderExtras(['certifications', 'projects', 'courses'])]}
            </>
          )}
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
