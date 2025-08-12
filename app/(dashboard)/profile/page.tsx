'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { profileSchema, ProfileFormData } from '@/lib/validations';
import { useAuth } from '@/providers/auth-provider';
import { User, Mail, Calendar, Loader2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await api.put('/auth/me', data);
      return response.data;
    },
    onSuccess: async () => {
      await refreshUser();
      toast.success('Profil mis à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8 text-blue-600" />
          Mon profil
        </h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du compte</CardTitle>
          <CardDescription>
            Vos informations personnelles et détails du compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {user.fullName || 'Utilisateur'}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Membre depuis {formatDistanceToNow(new Date(user.createdAt), { 
                    addSuffix: false, 
                    locale: fr 
                  })}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">Date d'inscription</p>
              <p>{format(new Date(user.createdAt), 'PPP', { locale: fr })}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">ID utilisateur</p>
              <p className="font-mono">{user.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Modifier le profil</CardTitle>
          <CardDescription>
            Mettez à jour vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                placeholder="Votre nom complet"
                {...register('fullName')}
                error={errors.fullName?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                {...register('email')}
                error={errors.email?.message}
              />
              <p className="text-xs text-muted-foreground">
                La modification de l'email nécessitera une nouvelle vérification
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions du compte</CardTitle>
          <CardDescription>
            Gérez votre compte et vos paramètres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Changer de mot de passe</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Pour votre sécurité, nous vous recommandons de changer régulièrement votre mot de passe.
              </p>
              <Button variant="outline" disabled>
                Changer le mot de passe (Bientôt disponible)
              </Button>
            </div>

            <div className="p-4 border rounded-lg border-red-200">
              <h4 className="font-medium mb-2 text-red-600">Zone de danger</h4>
              <p className="text-sm text-muted-foreground mb-3">
                La suppression de votre compte est irréversible et supprimera toutes vos données.
              </p>
              <Button variant="destructive" disabled>
                Supprimer le compte (Bientôt disponible)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}