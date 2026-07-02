import React from 'react';

interface InternshipCertificateProps {
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
}

export function InternshipCertificate({
  studentName = "Student Name",
  internshipDomain = "Internship Domain",
  startDate = "Start Date",
  endDate = "End Date",
  projectName = "Project Name",
  technologyStack = "Technology Stack",
  grade = "A+",
  certificateId = "CERT-000000",
  issueDate = "Issue Date",
  programDirectorName = "Program Director",
  programDirectorDesignation = "Designation",
  trainingHeadName = "Training Head",
  trainingHeadDesignation = "Designation"
}: InternshipCertificateProps) {
  const verificationUrl = `https://csdac.in/verify/${certificateId}`;
  
  return (
    <div className="flex justify-center items-center p-8 min-h-screen bg-slate-900 print:p-0 print:bg-white print:min-h-0 print:block">
      <div 
        className="relative overflow-hidden bg-white shadow-2xl print:shadow-none mx-auto"
        style={{
          width: '297mm',
          height: '210mm',
          background: 'linear-gradient(180deg, #fffef7 0%, #fefcf2 40%, #fdfaf0 100%)',
          color: '#1b3a5c' // Navy base color
        }}
      >
        {/* Top and Bottom Gold Gradient Bars */}
        <div className="absolute top-0 left-0 right-0 h-[4mm] z-10" style={{ background: 'linear-gradient(90deg, #1b3a5c 0%, #c5a028 30%, #daa520 50%, #c5a028 70%, #1b3a5c 100%)' }}></div>
        <div className="absolute bottom-0 left-0 right-0 h-[4mm] z-10" style={{ background: 'linear-gradient(90deg, #1b3a5c 0%, #c5a028 30%, #daa520 50%, #c5a028 70%, #1b3a5c 100%)' }}></div>

        {/* Four-Layer Border System */}
        <div className="absolute inset-[5mm] border-[1.5px] border-[#1b3a5c] z-0 pointer-events-none"></div>
        <div className="absolute inset-[7.5mm] border-[3px] border-[#c5a028] z-0 pointer-events-none"></div>
        <div className="absolute inset-[9mm] border-[0.8px] border-[#c5a028] opacity-50 z-0 pointer-events-none"></div>
        <div className="absolute inset-[10.5mm] border-[1.5px] border-[#1b3a5c] z-0 pointer-events-none"></div>

        {/* Side Decorative Lines */}
        <div className="absolute top-[35mm] bottom-[35mm] left-[13mm] w-[1px] opacity-30 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent, #c5a028 20%, #c5a028 80%, transparent)' }}></div>
        <div className="absolute top-[35mm] bottom-[35mm] right-[13mm] w-[1px] opacity-30 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent, #c5a028 20%, #c5a028 80%, transparent)' }}></div>

        {/* Corner Flourishes */}
        <div className="absolute top-[4mm] left-[4mm] z-10">
          <svg width="30mm" height="30mm" viewBox="0 0 120 120" fill="none"><path d="M6 6L6 55C6 60 10 64 15 64L55 64" stroke="#c5a028" strokeWidth="2.2" fill="none"/><path d="M6 6L55 6C60 6 64 10 64 15L64 55" stroke="#c5a028" strokeWidth="2.2" fill="none"/><path d="M6 6L35 35" stroke="#c5a028" strokeWidth="1.5"/><circle cx="6" cy="6" r="4" fill="#c5a028"/><path d="M18 6Q18 18 6 18" stroke="#1b3a5c" strokeWidth="1.2" fill="none"/><path d="M28 6Q28 28 6 28" stroke="#1b3a5c" strokeWidth="0.6" fill="none" opacity="0.4"/><circle cx="20" cy="20" r="1.8" fill="#c5a028" opacity="0.5"/><path d="M6 30Q14 22 30 6" stroke="#c5a028" strokeWidth="0.5" fill="none" opacity="0.3"/></svg>
        </div>
        <div className="absolute top-[4mm] right-[4mm] z-10" style={{ transform: 'scaleX(-1)' }}>
          <svg width="30mm" height="30mm" viewBox="0 0 120 120" fill="none"><path d="M6 6L6 55C6 60 10 64 15 64L55 64" stroke="#c5a028" strokeWidth="2.2" fill="none"/><path d="M6 6L55 6C60 6 64 10 64 15L64 55" stroke="#c5a028" strokeWidth="2.2" fill="none"/><path d="M6 6L35 35" stroke="#c5a028" strokeWidth="1.5"/><circle cx="6" cy="6" r="4" fill="#c5a028"/><path d="M18 6Q18 18 6 18" stroke="#1b3a5c" strokeWidth="1.2" fill="none"/><path d="M28 6Q28 28 6 28" stroke="#1b3a5c" strokeWidth="0.6" fill="none" opacity="0.4"/><circle cx="20" cy="20" r="1.8" fill="#c5a028" opacity="0.5"/><path d="M6 30Q14 22 30 6" stroke="#c5a028" strokeWidth="0.5" fill="none" opacity="0.3"/></svg>
        </div>
        <div className="absolute bottom-[4mm] left-[4mm] z-10" style={{ transform: 'scaleY(-1)' }}>
          <svg width="30mm" height="30mm" viewBox="0 0 120 120" fill="none"><path d="M6 6L6 55C6 60 10 64 15 64L55 64" stroke="#c5a028" strokeWidth="2.2" fill="none"/><path d="M6 6L55 6C60 6 64 10 64 15L64 55" stroke="#c5a028" strokeWidth="2.2" fill="none"/><path d="M6 6L35 35" stroke="#c5a028" strokeWidth="1.5"/><circle cx="6" cy="6" r="4" fill="#c5a028"/><path d="M18 6Q18 18 6 18" stroke="#1b3a5c" strokeWidth="1.2" fill="none"/><path d="M28 6Q28 28 6 28" stroke="#1b3a5c" strokeWidth="0.6" fill="none" opacity="0.4"/><circle cx="20" cy="20" r="1.8" fill="#c5a028" opacity="0.5"/><path d="M6 30Q14 22 30 6" stroke="#c5a028" strokeWidth="0.5" fill="none" opacity="0.3"/></svg>
        </div>
        <div className="absolute bottom-[4mm] right-[4mm] z-10" style={{ transform: 'scale(-1,-1)' }}>
          <svg width="30mm" height="30mm" viewBox="0 0 120 120" fill="none"><path d="M6 6L6 55C6 60 10 64 15 64L55 64" stroke="#c5a028" strokeWidth="2.2" fill="none"/><path d="M6 6L55 6C60 6 64 10 64 15L64 55" stroke="#c5a028" strokeWidth="2.2" fill="none"/><path d="M6 6L35 35" stroke="#c5a028" strokeWidth="1.5"/><circle cx="6" cy="6" r="4" fill="#c5a028"/><path d="M18 6Q18 18 6 18" stroke="#1b3a5c" strokeWidth="1.2" fill="none"/><path d="M28 6Q28 28 6 28" stroke="#1b3a5c" strokeWidth="0.6" fill="none" opacity="0.4"/><circle cx="20" cy="20" r="1.8" fill="#c5a028" opacity="0.5"/><path d="M6 30Q14 22 30 6" stroke="#c5a028" strokeWidth="0.5" fill="none" opacity="0.3"/></svg>
        </div>

        {/* Watermarks */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] z-0 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/csdac-navbar.png" alt="" className="h-[220px] object-contain" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span 
            className="text-[#1b3a5c] opacity-[0.018] tracking-[25px] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '90px', fontWeight: 900, transform: 'rotate(-30deg)' }}
          >
            CSDAC
          </span>
        </div>

        {/* Main Content Wrapper */}
        <div className="relative z-20 w-full h-full flex flex-col pt-[18mm] px-[28mm] pb-[16mm]">
          
          {/* Header */}
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/csdac-navbar.png" alt="CSDAC" className="h-[50px] block mx-auto mb-2 object-contain" />
            <div className="flex items-center justify-center gap-3 my-[6px]">
              <div className="w-[80px] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #c5a028, transparent)' }}></div>
              <div className="w-[6px] h-[6px] bg-[#c5a028] rotate-45 shrink-0"></div>
              <div className="w-[80px] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #c5a028, transparent)' }}></div>
            </div>
            <div className="text-[#999] tracking-[4px] uppercase font-semibold text-[8px]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              Industry Internship & Skill Development Programme
            </div>
          </div>

          {/* Title */}
          <div className="text-center pt-[14px] pb-[8px]">
            <h1 
              className="font-bold text-[36px] tracking-[8px] uppercase uppercase"
              style={{ 
                fontFamily: 'var(--font-cinzel), serif',
                background: 'linear-gradient(135deg, #b8960f 0%, #daa520 40%, #c5a028 60%, #a08520 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Certificate of Completion
            </h1>
            <div className="flex items-center justify-center gap-[10px] mt-[6px]">
              <div className="w-[100px] h-[1.5px]" style={{ background: 'linear-gradient(90deg, transparent, #1b3a5c, transparent)' }}></div>
              <div className="w-[5px] h-[5px] bg-[#c5a028] rounded-full shrink-0"></div>
              <div className="w-[100px] h-[1.5px]" style={{ background: 'linear-gradient(90deg, transparent, #1b3a5c, transparent)' }}></div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col justify-center items-center text-center gap-[6px]">
            <p className="text-[#777] italic text-[17px]" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              This is to certify that
            </p>
            
            <div className="relative inline-block pb-[6px] px-[50px]">
              <div 
                className="text-[#1b3a5c] font-bold text-[44px] tracking-[2px]" 
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                {studentName}
              </div>
              <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #c5a028 20%, #daa520 50%, #c5a028 80%, transparent)' }}></div>
            </div>
            
            <div className="text-[#555] text-[15.5px] leading-[1.8] max-w-[600px] mt-2" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              has successfully completed the
              <span className="block font-bold text-[17px] text-[#1b3a5c] tracking-[2px] my-[3px]" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                {internshipDomain}
              </span>
              internship under the <span className="font-bold text-[#1b3a5c]">CSDAC Virtual Internship Programme</span> and has demonstrated commitment, technical proficiency, and successful completion of all assigned project milestones.
            </div>
            
            <p className="text-[#999] font-medium text-[11px] tracking-[0.8px] mt-[2px]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              {startDate} &mdash; {endDate} &nbsp;&bull;&nbsp; Duration: 8 Weeks
            </p>

            {/* Info Bar */}
            <div className="relative flex max-w-[540px] mt-[12px] border border-[#c5a028]/25 overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(253,250,240,0.9), rgba(255,254,247,0.9))' }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #c5a028 30%, #c5a028 70%, transparent)' }}></div>
              
              <div className="flex-1 py-[9px] px-[14px] text-center border-r border-[#c5a028]/15">
                <div className="text-[#bbb] font-bold text-[7px] tracking-[2.5px] uppercase mb-[3px]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Project</div>
                <div className="text-[#1b3a5c] font-semibold text-[13.5px] truncate max-w-[150px]" style={{ fontFamily: 'var(--font-playfair), serif' }} title={projectName}>{projectName || 'N/A'}</div>
              </div>
              
              <div className="flex-1 py-[9px] px-[14px] text-center border-r border-[#c5a028]/15">
                <div className="text-[#bbb] font-bold text-[7px] tracking-[2.5px] uppercase mb-[3px]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Technology</div>
                <div className="text-[#1b3a5c] font-semibold text-[13.5px] truncate max-w-[150px]" style={{ fontFamily: 'var(--font-playfair), serif' }} title={technologyStack}>{technologyStack || 'N/A'}</div>
              </div>
              
              <div className="flex-1 py-[9px] px-[14px] text-center">
                <div className="text-[#bbb] font-bold text-[7px] tracking-[2.5px] uppercase mb-[3px]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Performance</div>
                <div className="text-[#1b3a5c] font-semibold text-[13.5px]" style={{ fontFamily: 'var(--font-playfair), serif' }}>{grade || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-end pt-[10px] mt-[10px] border-t border-[#e8e0cc]">
            
            {/* Left: Cert Details & QR */}
            <div className="text-left flex flex-col justify-end">
              <div>
                <div className="text-[#bbb] font-bold text-[6.5px] tracking-[1.5px] uppercase" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Certificate No.</div>
                <div className="text-[#1b3a5c] font-semibold text-[10.5px] mb-[5px]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{certificateId}</div>
                
                <div className="text-[#bbb] font-bold text-[6.5px] tracking-[1.5px] uppercase" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Date of Issue</div>
                <div className="text-[#1b3a5c] font-semibold text-[10.5px]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{issueDate}</div>
              </div>
            </div>

            {/* Center: Seal Logo */}
            <div className="flex flex-col items-center gap-[3px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/csdac-navbar.png" alt="CSDAC" className="h-[42px] opacity-15 object-contain" />
              <span className="text-[#ccc] font-bold text-[6px] tracking-[2.5px] uppercase" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Digitally Verified</span>
            </div>

            {/* Right: Signatures */}
            <div className="flex justify-end gap-[30px]">
              
              <div className="text-center min-w-[115px]">
                <div className="w-[125px] h-[34px] border-b border-[#aaa] flex items-end justify-center mb-[4px] relative">
                  {programDirectorName === "Dr. Aditi Verma" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/assets/img/signatures/aditi.jpg" alt="Signature" className="absolute bottom-[2px] h-[30px] object-contain opacity-80" style={{ mixBlendMode: 'multiply' }} />
                  ) : (
                    <span className="text-[#1b3a5c] opacity-55 text-[19px] italic pb-[2px]" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                      {programDirectorName.split(' ')[0]}
                    </span>
                  )}
                </div>
                <div className="text-[#1b3a5c] font-bold text-[9.5px]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{programDirectorName}</div>
                <div className="text-[#999] uppercase tracking-[1.2px] font-medium text-[7px]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{programDirectorDesignation}</div>
              </div>
              
              <div className="text-center min-w-[115px]">
                <div className="w-[125px] h-[34px] border-b border-[#aaa] flex items-end justify-center mb-[4px] relative">
                  {trainingHeadName === "Rajesh Kumar" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/assets/img/signatures/rajesh.jpg" alt="Signature" className="absolute bottom-[2px] h-[30px] object-contain opacity-80" style={{ mixBlendMode: 'multiply' }} />
                  ) : (
                    <span className="text-[#1b3a5c] opacity-55 text-[19px] italic pb-[2px]" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                      {trainingHeadName.split(' ')[0]}
                    </span>
                  )}
                </div>
                <div className="text-[#1b3a5c] font-bold text-[9.5px]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{trainingHeadName}</div>
                <div className="text-[#999] uppercase tracking-[1.2px] font-medium text-[7px]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>{trainingHeadDesignation}</div>
              </div>
              
            </div>
          </div>
          
          <div className="text-center mt-[5px] text-[#ccc] text-[6.5px] tracking-[2.5px] uppercase" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            Verify Authenticity at &nbsp; csdac.in/verify/{certificateId}
          </div>
          
        </div>
      </div>
    </div>
  );
}
