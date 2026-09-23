import React, { useState } from 'react';
import useResumeData from '@/app/hooks/useResumeData';
import type { Experience } from '@/app/types/resume';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Card } from '@/app/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { toMonthInputValue } from '@/app/utils/resumeDate';

export function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, deleteExperience } = useResumeData();
  const { experiences } = resumeData;

  const [newExp, setNewExp] = useState<Omit<Experience, 'id'>>({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  const resetExpForm = () => {
    setNewExp({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    setEditingExpId(null);
  };

  const handleAdd = () => {
    if (newExp.title && newExp.company) {
      if (editingExpId) {
        updateExperience(editingExpId, newExp);
      } else {
        addExperience(newExp);
      }
      resetExpForm();
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingExpId(exp.id);
    setNewExp({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Experiência Profissional</h3>
        <p className="text-gray-600">Adicione suas experiências de trabalho</p>
      </div>

      {/* Existing experiences */}
      {experiences.length > 0 && (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <Card key={exp.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(exp)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteExperience(exp.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add new experience */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="font-medium">Nova Experiência</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expTitle">
              <span>Cargo</span>
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="expTitle"
              value={newExp.title}
              onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
              placeholder="Programador Full Stack"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="expCompany">
              <span>Empresa</span>
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="expCompany"
              value={newExp.company}
              onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
              placeholder="Empresa de Tecnologia"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="expLocation">Localização</Label>
          <Input
            id="expLocation"
            value={newExp.location}
            onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
            placeholder="Luanda, Angola"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expStart">Data de Início <span className="font-normal text-gray-500">(mês e ano)</span></Label>
            <Input
              id="expStart"
              type="month"
              value={toMonthInputValue(newExp.startDate)}
              onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="expEnd">Data de Término <span className="font-normal text-gray-500">(mês e ano)</span></Label>
            <Input
              id="expEnd"
              type="month"
              value={toMonthInputValue(newExp.endDate)}
              onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
              disabled={newExp.current}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="expCurrent"
            checked={newExp.current}
            onCheckedChange={(checked) =>
              setNewExp({ ...newExp, current: checked as boolean })
            }
          />
          <Label htmlFor="expCurrent" className="cursor-pointer">
            Trabalho atualmente nesta empresa
          </Label>
        </div>

        <div>
          <Label htmlFor="expDescription">Descrição</Label>
          <Textarea
            id="expDescription"
            value={newExp.description}
            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
            placeholder="Descreva suas principais responsabilidades e conquistas..."
            className="mt-1 min-h-[100px]"
          />
        </div>

        {editingExpId && (
          <div className="flex gap-2">
            <Button onClick={resetExpForm} variant="ghost" className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleAdd} className="flex-1" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Salvar alterações
            </Button>
          </div>
        )}

        {!editingExpId && (
          <Button onClick={handleAdd} className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Experiência
          </Button>
        )}
      </div>
    </div>
  );
}
