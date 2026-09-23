import React, { useState } from 'react';
import useResumeData from '@/app/hooks/useResumeData';
import type { Education } from '@/app/types/resume';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Card } from '@/app/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { toMonthInputValue } from '@/app/utils/resumeDate';

export function EducationForm() {
  const { resumeData, addEducation, updateEducation, deleteEducation } = useResumeData();
  const { education } = resumeData;

  const [newEdu, setNewEdu] = useState<Omit<Education, 'id'>>({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });
  const [editingEduId, setEditingEduId] = useState<string | null>(null);

  const resetEduForm = () => {
    setNewEdu({
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    setEditingEduId(null);
  };

  const handleAdd = () => {
    if (newEdu.degree && newEdu.institution) {
      if (editingEduId) {
        updateEducation(editingEduId, newEdu);
      } else {
        addEducation(newEdu);
      }
      resetEduForm();
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingEduId(edu.id);
    setNewEdu({
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location,
      startDate: edu.startDate,
      endDate: edu.endDate,
      current: edu.current,
      description: edu.description,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Formação Acadêmica</h3>
        <p className="text-gray-600">Adicione a sua formação e certificações</p>
      </div>

      {/* Existing education */}
      {education.length > 0 && (
        <div className="space-y-3">
          {education.map((edu) => (
            <Card key={edu.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-sm text-gray-500">
                    {edu.startDate} - {edu.current ? 'Presente' : edu.endDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(edu)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteEducation(edu.id)}
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

      {/* Add new education */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="font-medium">Nova Formação</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eduDegree">
              <span>Título/Grau</span>
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="eduDegree"
              value={newEdu.degree}
              onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
              placeholder="Licenciatura em Engenharia Informática"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="eduInstitution">
              <span>Instituição</span>
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="eduInstitution"
              value={newEdu.institution}
              onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
              placeholder="Universidade Agostinho Neto"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="eduLocation">Localização</Label>
          <Input
            id="eduLocation"
            value={newEdu.location}
            onChange={(e) => setNewEdu({ ...newEdu, location: e.target.value })}
            placeholder="Luanda, Angola"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eduStart">Data de Início <span className="font-normal text-gray-500">(mês e ano)</span></Label>
            <Input
              id="eduStart"
              type="month"
              value={toMonthInputValue(newEdu.startDate)}
              onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="eduEnd">Data de Conclusão <span className="font-normal text-gray-500">(mês e ano)</span></Label>
            <Input
              id="eduEnd"
              type="month"
              value={toMonthInputValue(newEdu.endDate)}
              onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
              disabled={newEdu.current}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="eduCurrent"
            checked={newEdu.current}
            onCheckedChange={(checked) =>
              setNewEdu({ ...newEdu, current: checked as boolean })
            }
          />
          <Label htmlFor="eduCurrent" className="cursor-pointer">
            Atualmente cursando
          </Label>
        </div>

        <div>
          <Label htmlFor="eduDescription">Descrição (opcional)</Label>
          <Textarea
            id="eduDescription"
            value={newEdu.description}
            onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })}
            placeholder="Principais projetos, honras, ou atividades relevantes..."
            className="mt-1 min-h-[100px]"
          />
        </div>

        {editingEduId && (
          <div className="flex gap-2">
            <Button onClick={resetEduForm} variant="ghost" className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleAdd} className="flex-1" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Salvar alterações
            </Button>
          </div>
        )}

        {!editingEduId && (
          <Button onClick={handleAdd} className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Formação
          </Button>
        )}
      </div>
    </div>
  );
}
