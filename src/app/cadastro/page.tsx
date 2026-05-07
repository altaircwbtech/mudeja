import Link from "next/link";
import { signUp } from "@/lib/auth-actions";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;
  const success = params.success;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-orange-50/30 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Logo size="lg" />
          </Link>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-4 text-center">
            <h1 className="text-2xl font-bold">Criar conta</h1>
            <p className="text-sm text-muted-foreground">
              Comece a usar a MovaFácil — é grátis
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{decodeURIComponent(error)}</span>
              </div>
            )}

            {/* Success — check email */}
            {success === "check_email" ? (
              <div className="space-y-4 py-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Verifique seu email</h2>
                <p className="text-sm text-muted-foreground">
                  Enviamos um link de confirmação para o seu email. Clique no
                  link para ativar sua conta.
                </p>
                <Link href="/login">
                  <Button variant="outline" className="mt-2">
                    Ir para login
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <form action={signUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nome completo</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      placeholder="Seu nome"
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full shadow-md shadow-primary/25"
                    size="lg"
                  >
                    Criar conta grátis
                  </Button>
                </form>

                <p className="text-center text-xs text-muted-foreground">
                  Ao criar uma conta, você concorda com nossos{" "}
                  <Link href="/termos" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                  .
                </p>

                <div className="text-center text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    Entrar
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
