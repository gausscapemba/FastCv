import React from 'react';
import useResumeData from '@/app/hooks/useResumeData';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export function PersonalDataForm() {
  const { resumeData, updatePersonalData } = useResumeData();
  const { personalData } = resumeData;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Dados Pessoais</h3>
        <p className="text-gray-600">Comece com suas informações básicas</p>
      </div>

      <div className="space-y-4">
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
              placeholder="ana.mateus@angola.com"
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
              placeholder="linkedin.com/in/anaisabelmateus"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="website">Website/Portfolio</Label>
            <Input
              id="website"
              value={personalData.website}
              onChange={(e) => updatePersonalData({ website: e.target.value })}
              placeholder="anaisabel.design"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
