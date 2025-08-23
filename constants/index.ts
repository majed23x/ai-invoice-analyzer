import type { Invoice, Validity } from "../types";

// ✅ Reusable Validity mock data
const defaultValidity: Validity = {
    overallScore: 85,

    completeness: {
        score: 90,
        tips: [
            {
                type: "good",
                tip: "Required Fields Present",
                explanation: "All key invoice fields like ID, amount, and VAT are present and filled."
            }
        ]
    },

    accuracy: {
        score: 95,
        tips: [
            {
                type: "good",
                tip: "Correct VAT Calculation",
                explanation: "VAT and total match the expected formula (subtotal + VAT = total)."
            }
        ]
    },

    compliance: {
        score: 88,
        tips: [
            {
                type: "improve",
                tip: "Missing TRN",
                explanation: "The invoice does not include a UAE Tax Registration Number (TRN)."
            }
        ]
    },

    formatting: {
        score: 80,
        tips: [
            {
                type: "good",
                tip: "Clear Structure",
                explanation: "The invoice layout is well-structured with clear labels."
            }
        ]
    },

    fraudRisk: {
        score: 92,
        tips: [
            {
                type: "good",
                tip: "No Suspicious Patterns",
                explanation: "No duplicated invoice numbers or irregular totals were found."
            }
        ]
    }
};

// ✅ Invoice array
export const invoices: Invoice[] = [
    {
        id: "1",
        companyName: "Google",
        invoiceNumber: "12345",
        itemDesc: "Food Supply",
        Amount: 50,
        Vat: 2.5,
        totalAmount: 52.5,
        invoicePath: "/images/resume_01.png",
        proofPath: "/proofs/proof-1.pdf",
        validity: defaultValidity
    },
    {
        id: "2",
        companyName: "Apple",
        invoiceNumber: "123456",
        itemDesc: "Mouse",
        Amount: 100,
        Vat: 5,
        totalAmount: 105,
        invoicePath: "/images/resume_02.png",
        proofPath: "/proofs/proof-2.pdf",
        validity: defaultValidity
    },
    {
        id: "3",
        companyName: "Tesla",
        invoiceNumber: "1234567",
        itemDesc: "Computer",
        Amount: 2000,
        Vat: 100,
        totalAmount: 2100,
        invoicePath: "/images/resume_03.png",
        proofPath: "/proofs/proof-3.pdf",
        validity: defaultValidity
    }
];

// ✅ Stringified format to pass into an LLM prompt
export const AIResponseFormat = `
interface Validity {
  overallScore: number;

  completeness: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };

  accuracy: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };

  compliance: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };

  formatting: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };

  fraudRisk: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
}
`;

// ✅ AI prompt generator
export const prepareInstructions = ({
                                        companyName,
                                        invoicePurpose,
                                        invoiceNumber,              // NEW
                                        responseFormat = AIResponseFormat,
                                    }: {
    companyName: string;
    invoicePurpose: string;
    invoiceNumber?: string;     // NEW
    responseFormat?: string;
}) => `
You are a financial document analysis AI trained to verify and evaluate invoices.

Please carefully analyze the attached invoice and assess it across various financial and regulatory criteria.

The company name is: ${companyName}
The invoice is submitted for the following purpose: ${invoicePurpose}
${invoiceNumber ? `Invoice number: ${invoiceNumber}` : ""}

You must:
- Validate calculation accuracy (subtotal, VAT, total).
- Check for completeness (invoice number, dates, totals, company info, etc.).
- Assess formatting and legibility.
- Identify any potential fraud risks or inconsistencies.
- Ensure compliance with UAE VAT or relevant tax law.

Provide detailed feedback using the following format:
${responseFormat}

Return the analysis as a pure JSON object — no extra text, headers, comments, or backticks.
`.trim();
