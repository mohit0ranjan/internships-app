"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, CheckCircle, Clock, ExternalLink, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

export default function CertificatePage() {
  const { data, error, isLoading } = useSWR('/api/student/certificate');

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
  }

  if (error || !data) {
    return <div className="text-red-500 text-center py-10">Failed to load certificate details.</div>
  }

  const { application, attendance, progress, certificate } = data;

  const isAttendanceMet = attendance?.percentage >= 75;
  const isProgressMet = progress?.count >= 4; // Assuming 4 is minimum required
  const isProjectMet = application?.project?.githubUrl ? true : false;
  
  const isEligible = isAttendanceMet && isProgressMet && isProjectMet && application?.status === 'COMPLETED';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Internship Certificate</h2>
        <p className="text-muted-foreground">Track your eligibility and download your verifiable completion certificate.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm">Attendance &gt; 75% ({attendance?.percentage || 0}%)</span>
                {isAttendanceMet ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm">Weekly Reports ({progress?.count || 0})</span>
                {isProgressMet ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm">Final Project Submission</span>
                {isProjectMet ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm">Internship Completed</span>
                {application?.status === 'COMPLETED' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Overall Status</span>
                {certificate ? (
                  <Badge variant="success">Issued</Badge>
                ) : isEligible ? (
                  <Badge variant="warning">Awaiting Issue</Badge>
                ) : (
                  <Badge variant="outline">In Progress</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification</CardTitle>
              <CardDescription>Your certificate is publicly verifiable.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                Every certificate issued by CSDAC contains a unique cryptographic QR code and ID number.
              </p>
              <p>
                Employers and institutions can scan the QR code or enter the ID at <span className="font-semibold text-navy-900 ">internships.csdac.in/verify</span> to instantly verify its authenticity.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {certificate ? (
            <Card className="h-full border-primary-200  shadow-md">
              <CardHeader className="text-center pb-2 bg-gradient-to-r from-primary-50 to-transparent ">
                <Award className="h-12 w-12 text-primary-600 mx-auto mb-2" />
                <CardTitle className="text-2xl text-primary-900 ">Certificate of Completion</CardTitle>
                <CardDescription>Issued on {new Date(certificate.issueDate).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-white  border rounded-lg p-6 shadow-sm relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50  rounded-bl-full -mr-16 -mt-16 z-0"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-50  rounded-tr-full -ml-12 -mb-12 z-0"></div>
                  
                  <div className="relative z-10 text-center space-y-4">
                    <div className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Certificate ID</div>
                    <div className="font-mono bg-muted inline-block px-3 py-1 rounded text-sm">{certificate.certificateNumber}</div>
                    
                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground mb-1">This is to certify that</p>
                      <h3 className="text-2xl font-serif font-bold text-navy-900 ">{application?.user?.name}</h3>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mt-4 mb-1">has successfully completed the Work-Based Learning Internship in</p>
                      <h4 className="text-lg font-semibold text-primary-700 ">{application?.internship?.domain}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Grade: <span className="font-bold text-navy-900 ">{certificate.grade}</span></p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-4 bg-muted/30 pt-6">
                <Button className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href={`/verify/${certificate.certificateNumber}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Public Link
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50  border-dashed">
              <Clock className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-bold text-navy-900  mb-2">Certificate Not Ready</h3>
              <p className="text-muted-foreground max-w-md">
                Your certificate will be generated and available for download here once you meet all eligibility criteria and your final project is evaluated by your mentor.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
