import React from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { X, Plus } from 'lucide-react';

export interface SchemaField {
  id: string;
  name: string;
  type: 'nested' | 'string' | 'number' | 'objectId' | 'float' | 'boolean';
  required: boolean;
  children?: SchemaField[];
}

interface Props {
  field: SchemaField;
  index: number;
  nestingLevel: number;
  levelPath: number[];
  onUpdate: (path: number[], field: SchemaField) => void;
  onDelete: (path: number[]) => void;
  onAddChild: (path: number[]) => void;
}

const SchemaFieldComponent: React.FC<Props> = ({
  field,
  nestingLevel,
  levelPath,
  onUpdate,
  onDelete,
  onAddChild
}) => {
  const marginLeft = nestingLevel * 40;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(levelPath, { ...field, name: e.target.value });
  };

  const handleTypeChange = (type: SchemaField['type']) => {
    const updatedField = { ...field, type };
    if (type !== 'nested') {
      updatedField.children = undefined;
    } else if (!updatedField.children) {
      updatedField.children = [];
    }
    onUpdate(levelPath, updatedField);
  };

  const handleRequiredChange = (required: boolean) => {
    onUpdate(levelPath, { ...field, required });
  };

  return (
    <div style={{ marginLeft }} className="mb-3">
      <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
        <div className="flex-1 min-w-0">
          <Input value={field.name} onChange={handleNameChange} placeholder="Field name" />
        </div>

        <div className="w-32">
          <Select value={field.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Field Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nested">nested</SelectItem>
              <SelectItem value="string">string</SelectItem>
              <SelectItem value="number">number</SelectItem>
              <SelectItem value="objectId">objectId</SelectItem>
              <SelectItem value="float">float</SelectItem>
              <SelectItem value="boolean">boolean</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Switch checked={field.required} onCheckedChange={handleRequiredChange} />

        <Button onClick={() => onDelete(levelPath)} variant="ghost" size="sm" className="p-2 hover:bg-red-50 hover:text-red-600">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {field.type === 'nested' && (
        <div className="mt-3">
          {field.children?.map((child, childIndex) => (
            <SchemaFieldComponent
              key={child.id}
              field={child}
              index={childIndex}
              nestingLevel={nestingLevel + 1}
              levelPath={[...levelPath, childIndex]}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}

          <div className="flex gap-2 mt-3 ml-[144px]">
            <Button
              type="button"
              onClick={() => onAddChild(levelPath)}
              className="bg-blue-600 w-full hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemaFieldComponent;