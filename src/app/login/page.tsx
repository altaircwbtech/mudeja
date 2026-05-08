import Link from "next/link";
import { signIn } from "@/lib/auth-actions";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function LoginPage() {
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
            <h1 className="text-2xl font-bold">Entrar</h1>
            <p className="text-sm text-muted-foreground">
              Acesse sua conta para gerenciar serviços
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <form action={signIn} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="/recuperar-senha"
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full shadow-md shadow-primary/25"
                size="lg"
              >
                Entrar
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="font-medium text-primary hover:underline">
                Cadastre-se grátis
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
