import React, { useState } from 'react';
import useResumeData from '@/app/hooks/useResumeData';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { X, Plus } from 'lucide-react';

export function SkillsForm() {
  const { resumeData, updateSkills } = useResumeData();
  const { skills } = resumeData;
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      updateSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemove = (skill: string) => {
    updateSkills(skills.filter((s) => s !== skill));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Competências</h3>
        <p className="text-gray-600">Adicione suas principais habilidades técnicas e comportamentais</p>
      </div>

      {/* Existing skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="pr-1 text-sm">
              {skill}
              <button
                onClick={() => handleRemove(skill)}
                className="ml-2 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add new skill */}
      <div className="space-y-2">
        <Label htmlFor="newSkill">Adicionar Competência</Label>
        <div className="flex gap-2">
          <Input
            id="newSkill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ex: React, TypeScript, Liderança de equipe..."
            className="flex-1"
          />
          <Button onClick={handleAdd} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-500">Pressione Enter ou clique no + para adicionar</p>
      </div>

      {/* Suggestions */}
      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-2">Sugestões populares:</p>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'Python', 'Comunicação', 'Trabalho em equipe', 'Gestão de projetos'].map(
            (suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  if (!skills.includes(suggestion)) {
                    updateSkills([...skills, suggestion]);
                  }
                }}
              >
                {suggestion} +
              </Badge>
            )
          )}
        </div>
      </div>
    </div>
  );
}
