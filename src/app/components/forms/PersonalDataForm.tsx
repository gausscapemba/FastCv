import React from 'react';
import { useState } from 'react';
import useResumeData from '@/app/hooks/useResumeData';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';

export function PersonalDataForm() {
  const { resumeData, settings, updatePersonalData } = useResumeData();
  const { personalData } = resumeData;
  const [photoError, setPhotoError] = useState('');
  const supportsPhoto = settings.layout === 'photo-side'
    || settings.layout === 'photo-centered'
    || (!settings.layout && Boolean(settings.photoLayout));

  const loadPhoto = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Seleccione um ficheiro de imagem.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError('A imagem deve ter menos de 10 MB.');
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 640 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      updatePersonalData({ photo: canvas.toDataURL('image/jpeg', 0.82) });
      setPhotoError('');
    } catch {
      setPhotoError('Não foi possível carregar esta imagem.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Dados Pessoais</h3>
        <p className="text-gray-600">Comece com suas informações básicas</p>
      </div>

      <div className="space-y-4">
        {supportsPhoto && <div className="flex flex-wrap items-center gap-4 rounded-md border bg-white p-3">
          {personalData.photo ? (
            <img src={personalData.photo} alt="Pré-visualização da fotografia do CV" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500">Foto</div>
          )}
          <div className="min-w-0 flex-1">
            <Label htmlFor="resumePhoto">Fotografia</Label>
            <Input id="resumePhoto" type="file" accept="image/*" className="mt-1" onChange={(event) => void loadPhoto(event.target.files?.[0])} />
            <p className="mt-1 text-xs text-gray-500">Opcional. A fotografia só aparece nos modelos com foto.</p>
            {photoError && <p role="alert" className="mt-1 text-xs text-red-700">{photoError}</p>}
          </div>
          {personalData.photo && <Button type="button" variant="outline" size="sm" onClick={() => updatePersonalData({ photo: '' })}>Remover</Button>}
        </div>}
        <div>
          <Label htmlFor="fullName">
            <span>Nome Completo</span>
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            value={personalData.fullName}
            onChange={(e) => updatePersonalData({ fullName: e.target.value })}
            placeholder="Ana Isabel Mateus"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="profession">
            <span>Profissão</span>
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="profession"
            value={personalData.profession}
            onChange={(e) => updatePersonalData({ profession: e.target.value })}
            placeholder="Product Designer e UX Strategist"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">
              <span>Email</span>
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={personalData.email}
              onChange={(e) => updatePersonalData({ email: e.target.value })}
              placeholder="exemplo@gmail.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={personalData.phone}
              onChange={(e) => updatePersonalData({ phone: e.target.value })}
              placeholder="+244 923 456 789"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            value={personalData.address}
            onChange={(e) => updatePersonalData({ address: e.target.value })}
            placeholder="Luanda, Angola"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={personalData.linkedin}
              onChange={(e) => updatePersonalData({ linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/o-seu-nome"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="website">Website/Portfolio</Label>
            <Input
              id="website"
              value={personalData.website}
              onChange={(e) => updatePersonalData({ website: e.target.value })}
              placeholder="https://o-seu-portfolio.com"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
