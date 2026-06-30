"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, ShieldAlert, Award, Calendar, Building2, BookOpen, Clock, User, Download, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function VerifyCertificatePage() {
  const params = useParams();
  const certNumber = params.certNumber as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`/api/verify/${certNumber}`);
        const json = await res.json();
        
        if (res.ok && json.valid) {
          setData(json.certificate);
        } else {
          setError(json.message || "Invalid certificate");
        }
      } catch (err) {
        setError("Failed to verify certificate. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    if (certNumber) {
      verify();
    }
  }, [certNumber]);

  return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {loading && (
          <Card className="border-navy-100 shadow-sm animate-pulse">
            <CardContent className="h-64 flex flex-col items-center justify-center text-navy-400">
              <RefreshCw className="w-8 h-8 animate-spin mb-4" />
              <p>Verifying certificate authenticity...</p>
            </CardContent>
          </Card>
        )}

        {!loading && error && (
          <Card className="border-red-200 bg-red-50/50 shadow-sm">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl text-red-700">Verification Failed</CardTitle>
              <CardDescription className="text-red-600/80">
                The certificate could not be authenticated
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-red-900 pb-8">
              <p>{error}</p>
              <p className="text-sm mt-4 font-mono bg-red-100 py-2 px-4 rounded inline-block">
                ID: {certNumber}
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && data && (
          <Card className="border-emerald-200 shadow-lg overflow-hidden relative">
            {/* Success decorative banner */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            
            <CardHeader className="text-center pb-2 pt-8 relative">
              <div className="absolute top-8 right-8 hidden sm:block">
                <img src="/assets/img/cdacLogo.png" alt="C-DAC" className="h-12 w-12 opacity-20" />
              </div>
              <div className="mx-auto w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-200">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <CardTitle className="text-2xl text-navy-900">Certificate Verified</CardTitle>
              <CardDescription className="text-emerald-700 font-medium">
                This is a valid and authentic C-DAC Internship Certificate
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm space-y-6">
                
                {/* ID & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-50">
                  <div>
                    <p className="text-xs text-navy-400 uppercase tracking-wider font-semibold mb-1">Certificate No.</p>
                    <p className="font-mono text-navy-900 font-bold bg-navy-50 px-2 py-1 rounded inline-block">{data.certificateNumber}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs text-navy-400 uppercase tracking-wider font-semibold mb-1">Issue Date</p>
                    <p className="text-navy-900 font-medium flex items-center sm:justify-end gap-1.5">
                      <Calendar className="w-4 h-4 text-navy-400" />
                      {new Date(data.issueDate).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Candidate Info */}
                <div>
                  <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-600" /> Candidate Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-navy-500 mb-0.5">Name</p>
                      <p className="font-semibold text-navy-900">{data.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-navy-500 mb-0.5">Degree</p>
                      <p className="font-medium text-navy-900">{data.degree}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm text-navy-500 mb-0.5">Institution</p>
                      <p className="font-medium text-navy-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-navy-400" /> {data.college}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Internship Info */}
                <div className="bg-navy-50 -mx-6 px-6 py-4 border-y border-navy-100">
                  <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent-500" /> Internship Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-navy-500 mb-0.5">Program Title</p>
                      <p className="font-semibold text-navy-900 text-lg">{data.internshipTitle}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-navy-500 mb-0.5">Domain</p>
                        <Badge variant="secondary" className="bg-primary-100 text-primary-700 hover:bg-primary-100">
                          {data.domain}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-navy-500 mb-0.5">Host Centre</p>
                        <p className="font-medium text-navy-900 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-navy-400" /> {data.centre}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-navy-500 mb-0.5">Duration</p>
                        <p className="font-medium text-navy-900 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-navy-400" /> {data.duration}
                        </p>
                      </div>
                      <div className="sm:col-span-2 pt-2 border-t border-navy-100/50 mt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-navy-500 mb-0.5">Project</p>
                            <p className="font-medium text-navy-900 truncate" title={data.projectName}>{data.projectName || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-navy-500 mb-0.5">Technology Stack</p>
                            <p className="font-medium text-navy-900 truncate" title={data.technology}>{data.technology || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-navy-500 mb-0.5">Performance Grade</p>
                            <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">
                              {data.grade || 'N/A'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Digital Seal */}
                <div className="flex flex-col items-center justify-center pt-4 border-t border-navy-50">
                  <div className="w-24 h-24 mb-2 relative flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-full h-full text-navy-900" fill="currentColor">
                      <circle cx="100" cy="100" r="95" fill="none" stroke="#C89B3C" strokeWidth="4" />
                      <circle cx="100" cy="100" r="88" fill="none" stroke="#0B3C5D" strokeWidth="2" strokeDasharray="4 4" />
                      <defs>
                        <path id="sealPath" d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" />
                        <path id="sealPathBottom" d="M 100, 100 m -70, 0 a 70,70 0 0,0 140,0" />
                      </defs>
                      <text fontSize="18" fontWeight="bold" fill="#0B3C5D" letterSpacing="2">
                        <textPath href="#sealPath" startOffset="50%" textAnchor="middle">• CSDAC OFFICIAL SEAL •</textPath>
                      </text>
                      <text fontSize="14" fontWeight="600" fill="#C89B3C" letterSpacing="1">
                        <textPath href="#sealPathBottom" startOffset="50%" textAnchor="middle">EXCELLENCE • INNOVATION • LEARNING</textPath>
                      </text>
                      <path d="M80 130 L100 80 L120 130 Z" fill="#0B3C5D" />
                      <circle cx="100" cy="110" r="10" fill="#C89B3C" />
                    </svg>
                  </div>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 font-medium">
                    Digitally Verified & Secured
                  </Badge>
                  <p className="text-xs text-navy-400 mt-2 font-mono">
                    Status: {data.status}
                  </p>
                </div>
                
              </div>
            </CardContent>
            <CardFooter className="bg-white border-t border-navy-100 p-4 flex justify-between items-center text-sm text-navy-500">
              <p>Verified by CSDAC Portal</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
                  <Download className="w-4 h-4" /> Save Record
                </Button>
                {data.pdfUrl && (
                  <Button size="sm" className="gap-2 bg-navy-900 hover:bg-navy-800 text-white" asChild>
                    <a href={data.pdfUrl} target="_blank" rel="noopener noreferrer">
                      Download PDF
                    </a>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
