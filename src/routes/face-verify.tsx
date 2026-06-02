
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, UserCircle2, CheckCircle2, XCircle, Loader2, RefreshCw, ShieldCheck, ScanLine, BadgeCheck, GraduationCap, Banknote } from "lucide-react";
import { FaceCapture } from "./verify";
import { useAuth } from "@/lib/auth";
import { verifyFaceFn } from "@/lib/face-verify-fn";

const base64ToBlob = (base64: string, mimeType = "image/jpeg") => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

export const Route = createFileRoute("/face-verify")({
  component: FaceVerifyPage,
});

function FaceVerifyPage() {
  const { session } = useAuth();
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [matchedData, setMatchedData] = useState<{ student: any, payment: any } | null>(null);

  useEffect(() => {
    loadPendingPayments();
  }, []);

  const loadPendingPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("payments")
        .select("*, students(*)")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPending(data || []);
    } catch (err: any) {
      toast.error("Erreur chargement: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onCapture = async (capturedImage: string) => {
    try {
      setIsVerifying(true);
      setResult(null);
      setMatchedData(null);

      if (pending.length === 0) throw new Error("Aucun paiement en attente.");

      const data = await verifyFaceFn({
        data: {
          capturedImage,
          candidates: pending.map(p => ({
            paymentId: p.id,
            studentId: p.student_id,
            name: p.students?.full_name || "Étudiant"
          }))
        }
      });
      
      setResult(data);

      if (data.isMatch && data.paymentId) {
        const match = pending.find(p => p.id === data.paymentId);
        if (match) {
          setMatchedData({ student: match.students, payment: match });
        }

        toast.success("Visage reconnu !");

        let capturedPhotoUrl: string | null = null;
        try {
          const blob = base64ToBlob(capturedImage);
          const path = `captures/${crypto.randomUUID()}.jpg`;
          const { error: upErr } = await supabase.storage
            .from("student-photos")
            .upload(path, blob, { contentType: "image/jpeg" });
          
          if (upErr) throw upErr;
          
          capturedPhotoUrl = supabase.storage
            .from("student-photos")
            .getPublicUrl(path).data.publicUrl;
        } catch (uploadErr) {
          console.error("Erreur lors de l'upload de la capture:", uploadErr);
        }
        
        await supabase
          .from("payments")
          .update({
            status: "verified",
            face_match: true,
            confidence_score: data.confidence,
            face_analysis: data.reasoning,
            verified_by: session?.user?.id,
            ...(capturedPhotoUrl ? { captured_photo_url: capturedPhotoUrl } : {})
          })
          .eq("id", data.paymentId);
      } else {
        toast.error("Échec de la reconnaissance.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  // Helper pour le message de pension
  const getPensionMessage = (amount: number) => {
    if (amount === 25000) return "PREMIÈRE TRANCHE PAYÉE";
    if (amount === 50000) return "TOTALITÉ DE LA PENSION PAYÉE";
    return "PENSION PAYÉE";
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-primary h-6 w-6" />
            Vérification de Paiement
          </h1>
          <Button variant="outline" size="sm" onClick={loadPendingPayments} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser ({pending.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 relative overflow-hidden group border-2 border-primary/5 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Scanner le visage
            </h2>
            <FaceCapture onCapture={onCapture} isVerifying={isVerifying} />
          </Card>

          <Card className="p-6 border-2 shadow-xl overflow-hidden relative">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
              <BadgeCheck className="h-5 w-5 text-primary" />
              Résultat de l'analyse
            </h2>
            
            {isVerifying ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                <p className="font-bold text-lg animate-pulse">Analyse biométrique...</p>
              </div>
            ) : matchedData ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative bg-white dark:bg-zinc-900 p-5 rounded-xl border border-green-500/20 shadow-sm flex flex-col items-center">
                    
                    {/* PHOTO DE L'ÉTUDIANT (Issue de l'inscription) */}
                    <div className="relative mb-6">
                      <div className="h-44 w-44 rounded-2xl overflow-hidden border-4 border-green-500/30 shadow-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        {(() => {
                          let displayUrl = matchedData.student.reference_photo_url;
                          if (displayUrl?.startsWith("[")) {
                            try {
                              const parsed = JSON.parse(displayUrl);
                              if (Array.isArray(parsed)) displayUrl = parsed[0];
                            } catch (e) {}
                          }
                          return displayUrl ? (
                            <img 
                              src={displayUrl} 
                              alt={matchedData.student.full_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserCircle2 className="h-20 w-20 text-zinc-300" />
                          );
                        })()}
                      </div>
                      <div className="absolute -bottom-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-white dark:border-zinc-900">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                    </div>

                    {/* INFOS ÉTUDIANT */}
                    <div className="w-full text-center space-y-3">
                      <div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                          {matchedData.student.full_name}
                        </h3>
                        <p className="text-xs font-bold text-zinc-500 font-mono tracking-widest mt-1">
                          MATRICULE: {matchedData.student.matricule}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 pt-2">
                        <div className="flex items-center justify-center gap-2 py-1.5 px-3 bg-blue-500/5 text-blue-600 rounded-full border border-blue-500/10">
                          <GraduationCap className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase">{matchedData.student.filiere}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 py-1.5 px-3 bg-zinc-500/5 text-zinc-600 rounded-full border border-zinc-500/10">
                          <Banknote className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase">PENSION: {matchedData.payment.amount?.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>

                    {/* BADGE TRANSACTION */}
                    <div className="mt-8 w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-black text-lg shadow-xl shadow-green-500/20 flex flex-col items-center justify-center uppercase tracking-tighter">
                      <span className="text-[10px] opacity-80 font-medium tracking-widest mb-1 italic">Statut du paiement</span>
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="h-6 w-6" />
                        {getPensionMessage(matchedData.payment.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : result && !result.isMatch ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="p-4 bg-red-500/10 rounded-full">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-red-600 uppercase">Non reconnu</p>
                  <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                </div>
                <Button variant="outline" className="mt-4" onClick={() => setResult(null)}>
                  Réessayer la capture
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <ScanLine className="h-24 w-24 mb-4 opacity-10" />
                <p className="font-medium">Prêt pour l'identification</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
