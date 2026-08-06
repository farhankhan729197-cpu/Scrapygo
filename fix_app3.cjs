const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(/\s*\/\/ Move to summary pickup page\n\s*setJourneyStep\(5\);\n\n\s*\/\/ Automatically send confirmation message via WhatsApp\n\s*handleWhatsAppCheckoutWithDetails\(newRequest\);\n\s*\};\n/, `
  const handleCompleteBooking = (name: string, phone: string, address: string) => {
    if (!journeyModel || !currentUser) return;
    const newRequest: EvaluationRequest = {
      id: evaluationId,
      category: selectedCategory,
      brand: journeyBrand?.name || 'Generic',
      model: journeyModel.name,
      condition: condition,
      capacity: selectedCategory === 'AC' ? capacity : selectedCategory === 'Refrigerator' ? fridgeCapacity : selectedCategory === 'InverterBattery' ? batteryCapacity : undefined,
      energyRating: selectedCategory === 'AC' ? energyRating : undefined,
      issues: [...selectedIssues],
      estimatedPrice: estimatedPrice,
      phone: currentUser.phone,
      status: 'Pending Pickup',
      pickupName: name,
      pickupPhone: phone,
      pickupAddress: address,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    const updatedHistory = [newRequest, ...evaluationHistory];
    localStorage.setItem('scrapygo_history', JSON.stringify(updatedHistory));
    setEvaluationHistory(updatedHistory);

    setJourneyStep(5);
    handleWhatsAppCheckoutWithDetails(newRequest);
  };
`);
fs.writeFileSync('src/App.tsx', code);
