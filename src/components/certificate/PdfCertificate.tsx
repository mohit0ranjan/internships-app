import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register standard fonts or fallback to built-in ones.
// We'll use Times-Roman for Serif and Helvetica for Sans-Serif.

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fefcf2',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  // Gradients aren't fully supported in React-PDF in the same way as CSS, 
  // so we use solid fallback colors or Image backgrounds if necessary.
  // We will use solid colors that match the aesthetic.
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#1b3a5c', // Navy
    borderBottomWidth: 3,
    borderBottomColor: '#c5a028', // Gold
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#1b3a5c',
    borderTopWidth: 3,
    borderTopColor: '#c5a028',
  },
  outerBorder: {
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
    borderWidth: 1.5,
    borderColor: '#1b3a5c',
  },
  innerBorder1: {
    position: 'absolute',
    top: 28,
    bottom: 28,
    left: 28,
    right: 28,
    borderWidth: 3,
    borderColor: '#c5a028',
  },
  innerBorder2: {
    position: 'absolute',
    top: 34,
    bottom: 34,
    left: 34,
    right: 34,
    borderWidth: 1,
    borderColor: '#c5a028',
    opacity: 0.5,
  },
  innerBorder3: {
    position: 'absolute',
    top: 40,
    bottom: 40,
    left: 40,
    right: 40,
    borderWidth: 1.5,
    borderColor: '#1b3a5c',
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 65,
    paddingHorizontal: 80,
    paddingBottom: 60,
    flexDirection: 'column',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerSubText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 10,
  },
  title: {
    fontFamily: 'Times-Bold',
    fontSize: 32,
    color: '#b8960f',
    textTransform: 'uppercase',
    letterSpacing: 4,
    textAlign: 'center',
    marginTop: 10,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 15,
  },
  separatorLine: {
    width: 80,
    height: 1,
    backgroundColor: '#1b3a5c',
  },
  separatorDiamond: {
    width: 5,
    height: 5,
    backgroundColor: '#c5a028',
    marginHorizontal: 8,
  },
  bodySection: {
    alignItems: 'center',
    flex: 1,
  },
  certifyText: {
    fontFamily: 'Times-Italic',
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  studentName: {
    fontFamily: 'Times-Bold',
    fontSize: 40,
    color: '#1b3a5c',
    textAlign: 'center',
  },
  studentNameUnderline: {
    width: 250,
    height: 1,
    backgroundColor: '#c5a028',
    marginTop: 5,
    marginBottom: 20,
  },
  descriptionText: {
    fontFamily: 'Times-Roman',
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    lineHeight: 1.6,
    maxWidth: 550,
  },
  domainText: {
    fontFamily: 'Times-Bold',
    fontSize: 16,
    color: '#1b3a5c',
  },
  durationText: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#666',
    marginTop: 12,
    letterSpacing: 1,
  },
  infoBar: {
    flexDirection: 'row',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e8e0cc',
    backgroundColor: '#fffdf5',
    width: 500,
  },
  infoBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e8e0cc',
  },
  infoBoxLast: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Times-Bold',
    fontSize: 12,
    color: '#1b3a5c',
    textAlign: 'center',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e8e0cc',
    paddingTop: 15,
    marginTop: 10,
  },
  footerLeft: {
    flex: 1,
  },
  footerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  footerRight: {
    flex: 1.2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  certLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  certValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#1b3a5c',
    marginBottom: 8,
  },
  signatureBlock: {
    alignItems: 'center',
    marginLeft: 30,
    width: 120,
  },
  signatureLine: {
    width: 120,
    height: 1,
    backgroundColor: '#aaa',
    marginBottom: 5,
  },
  signatureName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#1b3a5c',
  },
  signatureTitle: {
    fontFamily: 'Helvetica',
    fontSize: 6,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  signatureImage: {
    width: 80,
    height: 25,
    marginBottom: 2,
    objectFit: 'contain',
  },
  signatureTextFallback: {
    fontFamily: 'Times-Italic',
    fontSize: 18,
    color: '#1b3a5c',
    opacity: 0.6,
    marginBottom: 2,
  },
  logoImage: {
    width: 60,
    height: 40,
    marginBottom: 4,
    opacity: 0.15,
    objectFit: 'contain',
  },
  headerLogo: {
    width: 120,
    height: 40,
    marginBottom: 6,
    objectFit: 'contain',
  },
  verifyText: {
    fontFamily: 'Helvetica',
    fontSize: 7,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 15,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  }
});

interface PdfCertificateProps {
  studentName: string;
  internshipDomain: string;
  startDate: string;
  endDate: string;
  projectName: string;
  technologyStack: string;
  grade: string;
  certificateId: string;
  issueDate: string;
  programDirectorName: string;
  programDirectorDesignation: string;
  trainingHeadName: string;
  trainingHeadDesignation: string;
  logoSrc?: string;
  sign1Src?: string;
  sign2Src?: string;
}

export const PdfCertificate = ({
  studentName,
  internshipDomain,
  startDate,
  endDate,
  projectName,
  technologyStack,
  grade,
  certificateId,
  issueDate,
  programDirectorName,
  programDirectorDesignation,
  trainingHeadName,
  trainingHeadDesignation,
  logoSrc,
  sign1Src,
  sign2Src,
}: PdfCertificateProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Decorative Borders */}
      <View style={styles.topBar} />
      <View style={styles.bottomBar} />
      <View style={styles.outerBorder} />
      <View style={styles.innerBorder1} />
      <View style={styles.innerBorder2} />
      <View style={styles.innerBorder3} />

      <View style={styles.contentWrapper}>
        
        {/* Header */}
        <View style={styles.headerSection}>
          {logoSrc && <Image src={logoSrc} style={styles.headerLogo} />}
          <Text style={styles.headerSubText}>Industry Internship &amp; Skill Development Programme</Text>
        </View>

        {/* Title */}
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Certificate of Completion</Text>
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <View style={styles.separatorDiamond} />
            <View style={styles.separatorLine} />
          </View>
        </View>

        {/* Body */}
        <View style={styles.bodySection}>
          <Text style={styles.certifyText}>This is to certify that</Text>
          <Text style={styles.studentName}>{studentName || 'Student Name'}</Text>
          <View style={styles.studentNameUnderline} />
          
          <Text style={styles.descriptionText}>
            has successfully completed the <Text style={styles.domainText}>{internshipDomain || 'Domain'}</Text> internship under the CSDAC Virtual Internship Programme and has demonstrated commitment, technical proficiency, and successful completion of all assigned project milestones.
          </Text>

          <Text style={styles.durationText}>
            {startDate} - {endDate}
          </Text>

          <View style={styles.infoBar}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Project</Text>
              <Text style={styles.infoValue}>{projectName || 'N/A'}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Technology</Text>
              <Text style={styles.infoValue}>{technologyStack || 'N/A'}</Text>
            </View>
            <View style={styles.infoBoxLast}>
              <Text style={styles.infoLabel}>Performance</Text>
              <Text style={styles.infoValue}>{grade || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <View style={styles.footerLeft}>
            <Text style={styles.certLabel}>Certificate No.</Text>
            <Text style={styles.certValue}>{certificateId}</Text>
            
            <Text style={styles.certLabel}>Date of Issue</Text>
            <Text style={styles.certValue}>{issueDate}</Text>
          </View>

          <View style={styles.footerCenter}>
             {logoSrc && <Image src={logoSrc} style={styles.logoImage} />}
             <Text style={{ fontFamily: 'Times-Bold', fontSize: 10, color: '#c5a028', textAlign: 'center', letterSpacing: 2 }}>CSDAC</Text>
             <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 6, color: '#aaa', marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' }}>Digitally Verified</Text>
          </View>

          <View style={styles.footerRight}>
            <View style={styles.signatureBlock}>
              <View style={{ height: 30, justifyContent: 'flex-end', alignItems: 'center' }}>
                {sign1Src ? <Image src={sign1Src} style={styles.signatureImage} /> : <Text style={styles.signatureTextFallback}>{programDirectorName.split(' ')[0]}</Text>}
              </View>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>{programDirectorName}</Text>
              <Text style={styles.signatureTitle}>{programDirectorDesignation}</Text>
            </View>

            <View style={styles.signatureBlock}>
              <View style={{ height: 30, justifyContent: 'flex-end', alignItems: 'center' }}>
                {sign2Src ? <Image src={sign2Src} style={styles.signatureImage} /> : <Text style={styles.signatureTextFallback}>{trainingHeadName.split(' ')[0]}</Text>}
              </View>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>{trainingHeadName}</Text>
              <Text style={styles.signatureTitle}>{trainingHeadDesignation}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.verifyText}>Verify Authenticity at csdac.in/verify/{certificateId}</Text>
      </View>

    </Page>
  </Document>
);
