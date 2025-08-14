import { ArrayElement, SortingStep } from '@/types/algorithm';

export const generateRandomArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  const values = new Set<number>();
  
  while (values.size < size) {
    values.add(Math.floor(Math.random() * 300) + 10);
  }
  
  const uniqueValues = Array.from(values);
  for (let i = 0; i < size; i++) {
    array.push({
      value: uniqueValues[i],
      id: `element-${i}`,
      state: 'default'
    });
  }
  
  return array;
};

export const bubbleSort = (array: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = array.map(el => ({ ...el, state: 'default' as ArrayElement['state'] }));
  const n = arr.length;
  
  steps.push({
    array: [...arr],
    description: 'Starting Bubble Sort algorithm'
  });
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing step
      const comparingArray = arr.map((el, idx) => ({
        ...el,
        state: (idx === j || idx === j + 1) ? 'comparing' as const : el.state
      }));
      
      steps.push({
        array: [...comparingArray],
        comparing: [j, j + 1],
        description: `Comparing elements at positions ${j} and ${j + 1}`
      });
      
      if (arr[j].value > arr[j + 1].value) {
        // Swapping step
        const swappingArray = arr.map((el, idx) => ({
          ...el,
          state: (idx === j || idx === j + 1) ? 'swapping' as const : el.state
        }));
        
        steps.push({
          array: [...swappingArray],
          swapping: [j, j + 1],
          description: `Swapping elements at positions ${j} and ${j + 1}`
        });
        
        // Perform swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        // Reset states after swap
        arr[j].state = 'default';
        arr[j + 1].state = 'default';
      } else {
        // Reset states if no swap
        arr[j].state = 'default';
        arr[j + 1].state = 'default';
      }
    }
    
    // Mark last element as sorted
    (arr[n - 1 - i] as ArrayElement).state = 'sorted';
    steps.push({
      array: [...arr],
      description: `Element at position ${n - 1 - i} is now in its final position`
    });
  }
  
  // Mark first element as sorted
  if (arr.length > 0) {
    (arr[0] as ArrayElement).state = 'sorted';
    steps.push({
      array: [...arr],
      description: 'Bubble Sort completed! Array is now sorted.'
    });
  }
  
  return steps;
};

export const mergeSort = (array: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = array.map(el => ({ ...el, state: 'default' as ArrayElement['state'] }));
  
  steps.push({
    array: [...arr],
    description: 'Starting Merge Sort algorithm'
  });
  
  const mergeSortHelper = (start: number, end: number): void => {
    if (start >= end) return;
    
    const mid = Math.floor((start + end) / 2);
    
    // Highlight current subarray
    const highlightArray = arr.map((el, idx) => ({
      ...el,
      state: (idx >= start && idx <= end) ? 'comparing' as const : el.state
    }));
    
    steps.push({
      array: [...highlightArray],
      comparing: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      description: `Dividing subarray from index ${start} to ${end}`
    });
    
    mergeSortHelper(start, mid);
    mergeSortHelper(mid + 1, end);
    merge(start, mid, end);
  };
  
  const merge = (start: number, mid: number, end: number): void => {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    
    let i = 0, j = 0, k = start;
    
    // Highlight merge area
    const mergeArray = arr.map((el, idx) => ({
      ...el,
      state: (idx >= start && idx <= end) ? 'pivot' as const : el.state
    }));
    
    steps.push({
      array: [...mergeArray],
      description: `Merging subarrays from index ${start} to ${mid} and ${mid + 1} to ${end}`
    });
    
    while (i < left.length && j < right.length) {
      if (left[i].value <= right[j].value) {
        (arr[k] as ArrayElement) = { ...left[i], state: 'swapping' };
        i++;
      } else {
        (arr[k] as ArrayElement) = { ...right[j], state: 'swapping' };
        j++;
      }
      k++;
      
      steps.push({
        array: [...arr],
        swapping: [k - 1],
        description: `Placing element ${arr[k - 1].value} in position ${k - 1}`
      });
    }
    
    while (i < left.length) {
      (arr[k] as ArrayElement) = { ...left[i], state: 'swapping' };
      steps.push({
        array: [...arr],
        swapping: [k],
        description: `Placing remaining element ${arr[k].value} in position ${k}`
      });
      i++;
      k++;
    }
    
    while (j < right.length) {
      (arr[k] as ArrayElement) = { ...right[j], state: 'swapping' };
      steps.push({
        array: [...arr],
        swapping: [k],
        description: `Placing remaining element ${arr[k].value} in position ${k}`
      });
      j++;
      k++;
    }
    
    // Mark merged section as sorted if it's the final merge
    if (start === 0 && end === arr.length - 1) {
      for (let idx = start; idx <= end; idx++) {
        (arr[idx] as ArrayElement).state = 'sorted';
      }
      steps.push({
        array: [...arr],
        description: 'Merge Sort completed! Array is now sorted.'
      });
    } else {
      // Reset states for merged section
      for (let idx = start; idx <= end; idx++) {
        arr[idx].state = 'default';
      }
    }
  };
  
  mergeSortHelper(0, arr.length - 1);
  
  return steps;
};