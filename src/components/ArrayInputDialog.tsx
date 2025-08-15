import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Edit3, Check, X, Shuffle, Calculator } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { NumberInputPad } from './NumberInputPad';

interface ArrayInputDialogProps {
  onArraySubmit: (array: number[]) => void;
  isPlaying: boolean;
}

export const ArrayInputDialog = ({ onArraySubmit, isPlaying }: ArrayInputDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showNumberPad, setShowNumberPad] = useState(false);

  const addNumber = () => {
    const num = parseInt(inputValue);
    if (!isNaN(num) && numbers.length < 50) {
      setNumbers([...numbers, num]);
      setInputValue('');
      toast({
        title: "Number Added",
        description: `Added ${num} to the array.`,
      });
    } else if (numbers.length >= 50) {
      toast({
        title: "Array Full",
        description: "Maximum 50 numbers allowed.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Invalid Number",
        description: "Please enter a valid number.",
        variant: "destructive",
      });
    }
  };

  const removeNumber = (index: number) => {
    setNumbers(numbers.filter((_, i) => i !== index));
    toast({
      title: "Number Removed",
      description: "Number removed from array.",
    });
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(numbers[index].toString());
  };

  const saveEdit = () => {
    const newValue = parseInt(editValue);
    if (!isNaN(newValue)) {
      const newNumbers = [...numbers];
      newNumbers[editingIndex!] = newValue;
      setNumbers(newNumbers);
      setEditingIndex(null);
      setEditValue('');
      toast({
        title: "Number Updated",
        description: `Updated to ${newValue}.`,
      });
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const shuffleArray = () => {
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    setNumbers(shuffled);
    toast({
      title: "Array Shuffled",
      description: "Numbers have been randomly shuffled.",
    });
  };

  const clearAll = () => {
    setNumbers([]);
    toast({
      title: "Array Cleared",
      description: "All numbers removed.",
    });
  };

  const handleSubmit = () => {
    if (numbers.length === 0) {
      toast({
        title: "Empty Array",
        description: "Please add some numbers first.",
        variant: "destructive",
      });
      return;
    }
    
    onArraySubmit(numbers);
    setIsOpen(false);
    toast({
      title: "Array Loaded",
      description: `Custom array with ${numbers.length} numbers loaded for visualization.`,
    });
  };

  const loadPreset = (type: 'ascending' | 'descending' | 'random') => {
    let preset: number[] = [];
    const size = Math.min(15, 50);
    
    switch (type) {
      case 'ascending':
        preset = Array.from({ length: size }, (_, i) => (i + 1) * 5);
        break;
      case 'descending':
        preset = Array.from({ length: size }, (_, i) => (size - i) * 5);
        break;
      case 'random':
        preset = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
        break;
    }
    
    setNumbers(preset);
    toast({
      title: "Preset Loaded",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} preset loaded.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          disabled={isPlaying}
          className="hover:shadow-glow transition-all duration-300"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Custom Array Builder
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Interactive Array Builder
          </DialogTitle>
          <DialogDescription>
            Create your custom array by adding, editing, or removing numbers. Perfect for testing specific sorting scenarios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Presets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Presets</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => loadPreset('ascending')}>
                  Ascending (5, 10, 15...)
                </Button>
                <Button size="sm" variant="outline" onClick={() => loadPreset('descending')}>
                  Descending (75, 70, 65...)
                </Button>
                <Button size="sm" variant="outline" onClick={() => loadPreset('random')}>
                  Random Numbers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Manual Input</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter a number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputValue.trim()) {
                        addNumber();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button 
                    onClick={addNumber} 
                    disabled={!inputValue.trim() || numbers.length >= 50}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNumberPad(!showNumberPad)}
                  className="w-full"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  {showNumberPad ? 'Hide' : 'Show'} Number Pad
                </Button>
                <p className="text-xs text-muted-foreground">
                  {numbers.length}/50 numbers • Press Enter to add quickly
                </p>
              </CardContent>
            </Card>

            {showNumberPad && (
              <NumberInputPad 
                onNumberAdd={(num) => {
                  if (numbers.length < 50) {
                    setNumbers([...numbers, num]);
                    toast({
                      title: "Number Added",
                      description: `Added ${num} to the array.`,
                    });
                  }
                }}
                disabled={numbers.length >= 50}
              />
            )}
          </div>

          {/* Array Display */}
          {numbers.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Your Array ({numbers.length} numbers)</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={shuffleArray}>
                      <Shuffle className="h-3 w-3 mr-1" />
                      Shuffle
                    </Button>
                    <Button size="sm" variant="outline" onClick={clearAll}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg bg-muted/20">
                  {numbers.map((num, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-background border rounded-lg p-2 hover:shadow-sm transition-all group"
                    >
                      {editingIndex === index ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-16 h-6 text-xs"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit();
                              if (e.key === 'Escape') cancelEdit();
                            }}
                            autoFocus
                          />
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={saveEdit}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEdit}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Badge variant="secondary" className="font-mono">
                            {num}
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => startEdit(index)}
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                            onClick={() => removeNumber(index)}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Array Preview */}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Array Preview:</Label>
                  <div className="text-sm font-mono bg-muted/50 p-2 rounded border overflow-x-auto">
                    [{numbers.join(', ')}]
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={numbers.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            Load Array ({numbers.length} numbers)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};