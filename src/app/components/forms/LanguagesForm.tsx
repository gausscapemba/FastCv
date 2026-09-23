import React, { useState } from 'react';
import useResumeData from '@/app/hooks/useResumeData';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Card } from '@/app/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

const languageLevels = [
  'Básico',
  'Intermediário',
  'Avançado',
  'Fluente',
  'Nativo',
];

export function LanguagesForm() {
  const { resumeData, updateLanguages } = useResumeData();
  const { languages } = resumeData;

  const [newLanguage, setNewLanguage] = useState({ language: '', level: 'Intermediário' });

  const handleAdd = () => {
    if (newLanguage.language.trim()) {
      updateLanguages([...languages, newLanguage]);
      setNewLanguage({ language: '', level: 'Intermediário' });
    }
  };

  const handleRemove = (index: number) => {
    updateLanguages(languages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Idiomas</h3>
        <p className="text-gray-600">Adicione os idiomas que domina</p>
      </div>

      {/* Existing languages */}
      {languages.length > 0 && (
        <div className="space-y-3">
          {languages.map((lang, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-900">{lang.language}</span>
                  <span className="text-gray-600"> - {lang.level}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add new language */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="font-medium">Adicionar Idioma</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="language">Idioma</Label>
            <Input
              id="language"
              value={newLanguage.language}
              onChange={(e) =>
                setNewLanguage({ ...newLanguage, language: e.target.value })
              }
              placeholder="Português"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="level">Nível</Label>
            <Select
              value={newLanguage.level}
              onValueChange={(value) =>
                setNewLanguage({ ...newLanguage, level: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleAdd} className="w-full" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Idioma
        </Button>
      </div>
    </div>
  );
}
