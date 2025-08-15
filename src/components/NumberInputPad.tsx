import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Delete, Plus, ArrowLeft } from 'lucide-react';

interface NumberInputPadProps {
  onNumberAdd: (number: number) => void;
  disabled?: boolean;
}

export const NumberInputPad = ({ onNumberAdd, disabled = false }: NumberInputPadProps) => {
  const [currentInput, setCurrentInput] = useState('');

  const handleNumberClick = (digit: string) => {
    if (disabled) return;
    if (currentInput.length < 3) { // Limit to 3 digits
      setCurrentInput(prev => prev + digit);
    }
  };

  const handleClear = () => {
    setCurrentInput('');
  };

  const handleBackspace = () => {
    setCurrentInput(prev => prev.slice(0, -1));
  };

  const handleAdd = () => {
    if (currentInput && !disabled) {
      const number = parseInt(currentInput);
      if (!isNaN(number) && number > 0) {
        onNumberAdd(number);
        setCurrentInput('');
      }
    }
  };

  const numberButtons = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0']
  ];

  return (
    <Card className="w-full max-w-xs mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-center">Quick Number Pad</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display */}
        <div className="bg-muted/50 rounded-lg p-4 text-center min-h-[60px] flex items-center justify-center">
          {currentInput ? (
            <Badge variant="default" className="text-2xl font-mono px-4 py-2">
              {currentInput}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-sm">Enter a number</span>
          )}
        </div>

        {/* Number Grid */}
        <div className="grid grid-cols-3 gap-2">
          {numberButtons.flat().map((digit) => (
            <Button
              key={digit}
              variant="outline"
              size="lg"
              onClick={() => handleNumberClick(digit)}
              disabled={disabled}
              className="h-12 text-lg font-semibold hover:shadow-glow transition-all duration-200"
            >
              {digit}
            </Button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackspace}
            disabled={!currentInput || disabled}
            className="hover:bg-yellow-500/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!currentInput || disabled}
            className="hover:bg-red-500/10"
          >
            <Delete className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!currentInput || disabled}
            className="bg-primary hover:bg-primary/90 hover:shadow-glow"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Tap numbers then + to add to array
        </p>
      </CardContent>
    </Card>
  );
};