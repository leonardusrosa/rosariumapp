import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [loginData, setLoginData] = useState({ emailOrUsername: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(loginData.emailOrUsername, loginData.password);
      toast({
        title: "Login realizado com sucesso",
        description: "Rosarium tuum fructuosum et benedictum sit."
      });
      onOpenChange(false);
      setLoginData({ emailOrUsername: '', password: '' });
    } catch (error) {
      toast({
        title: "Falha no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Falha no registro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(registerData.email, registerData.password, registerData.username);
      toast({
        title: "Registro realizado com sucesso",
        description: "Sua conta foi criada com sucesso. Verifique seu email para confirmar sua conta."
      });
      onOpenChange(false);
      setRegisterData({ email: '', username: '', password: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: "Falha no registro",
        description: "Email pode já estar em uso. Tente um diferente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sacred-modal animate-fade-in">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-ancient-gold sacred-header-glow text-center">
            <i className="fas fa-cross mr-2 sm:mr-3 md:mr-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl" />
            Authenticatio
          </DialogTitle>
          <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto rounded-full mt-4 sm:mt-6"></div>
        </DialogHeader>

        {/* Sacred Tab Navigation */}
        <div className="mt-4 sm:mt-6 lg:mt-8">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[var(--cathedral-shadow)]/50 border border-[var(--ancient-gold-alpha)] rounded-lg p-1 mb-6">
            <TabsTrigger 
              value="login" 
              className="text-sacred-ivory font-inter text-sm data-[state=active]:bg-[var(--ancient-gold-alpha)] data-[state=active]:text-byzantine-gold data-[state=active]:border data-[state=active]:border-[var(--ancient-gold)] rounded-md transition-all duration-300"
            >
              <i className="fas fa-sign-in-alt mr-2 text-xs" />
              Entrar
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="text-sacred-ivory font-inter text-sm data-[state=active]:bg-[var(--ancient-gold-alpha)] data-[state=active]:text-byzantine-gold data-[state=active]:border data-[state=active]:border-[var(--ancient-gold)] rounded-md transition-all duration-300"
            >
              <i className="fas fa-user-plus mr-2 text-xs" />
              Criar conta
            </TabsTrigger>
          </TabsList>
          
          {/* Sign In Form */}
          <TabsContent value="login" className="space-y-5">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-email-username" className="text-byzantine-gold font-inter text-sm flex items-center">
                  <i className="fas fa-envelope mr-2 text-xs" />
                  Email ou Nome de Usuário
                </Label>
                <Input
                  id="login-email-username"
                  type="text"
                  value={loginData.emailOrUsername}
                  onChange={(e) => setLoginData(prev => ({ ...prev, emailOrUsername: e.target.value }))}
                  placeholder="Digite seu email ou nome de usuário"
                  className="bg-[var(--gothic-stone)] border-[var(--ancient-gold-alpha)] text-parchment placeholder-parchment/60 focus:border-[var(--byzantine-gold)] focus:ring-[var(--ancient-gold-glow)] rounded-lg h-11 font-crimson"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-byzantine-gold font-inter text-sm flex items-center">
                  <i className="fas fa-key mr-2 text-xs" />
                  Senha
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Digite sua senha"
                  className="bg-[var(--gothic-stone)] border-[var(--ancient-gold-alpha)] text-parchment placeholder-parchment/60 focus:border-[var(--byzantine-gold)] focus:ring-[var(--ancient-gold-glow)] rounded-lg h-11 font-crimson"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-[var(--ancient-gold-alpha)] hover:bg-[var(--ancient-gold-glow)] border border-[var(--ancient-gold)] text-byzantine-gold font-inter rounded-lg transition-all duration-300 mt-6"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
          
          {/* Register Form */}
          <TabsContent value="register" className="space-y-5">
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-byzantine-gold font-inter text-sm flex items-center">
                  <i className="fas fa-envelope mr-2 text-xs" />
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Digite seu email"
                  className="bg-[var(--gothic-stone)] border-[var(--ancient-gold-alpha)] text-parchment placeholder-parchment/60 focus:border-[var(--byzantine-gold)] focus:ring-[var(--ancient-gold-glow)] rounded-lg h-11 font-crimson"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-username" className="text-byzantine-gold font-inter text-sm flex items-center">
                  <i className="fas fa-user mr-2 text-xs" />
                  Nome de Usuário
                </Label>
                <Input
                  id="register-username"
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Escolha seu nome de usuário"
                  className="bg-[var(--gothic-stone)] border-[var(--ancient-gold-alpha)] text-parchment placeholder-parchment/60 focus:border-[var(--byzantine-gold)] focus:ring-[var(--ancient-gold-glow)] rounded-lg h-11 font-crimson"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-byzantine-gold font-inter text-sm flex items-center">
                  <i className="fas fa-key mr-2 text-xs" />
                  Senha
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Crie sua senha"
                  className="bg-[var(--gothic-stone)] border-[var(--ancient-gold-alpha)] text-parchment placeholder-parchment/60 focus:border-[var(--byzantine-gold)] focus:ring-[var(--ancient-gold-glow)] rounded-lg h-11 font-crimson"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-byzantine-gold font-inter text-sm flex items-center">
                  <i className="fas fa-shield-alt mr-2 text-xs" />
                  Confirmar Senha
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirme sua senha"
                  className="bg-[var(--gothic-stone)] border-[var(--ancient-gold-alpha)] text-parchment placeholder-parchment/60 focus:border-[var(--byzantine-gold)] focus:ring-[var(--ancient-gold-glow)] rounded-lg h-11 font-crimson"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-[var(--ancient-gold-alpha)] hover:bg-[var(--ancient-gold-glow)] border border-[var(--ancient-gold)] text-byzantine-gold font-inter rounded-lg transition-all duration-300 mt-6"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus mr-2" />
                    Criar conta
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        </div>

        {/* Sacred Footer */}
        <div className="text-center pt-4 border-t border-[var(--ancient-gold-alpha)] mt-6">
          <p className="text-sacred-ivory/60 font-cormorant italic text-[17px]">Ut Sancta Maria dignetur exaudire supplices nostras</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}