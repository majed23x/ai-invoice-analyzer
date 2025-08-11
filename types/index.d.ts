export interface Invoice {
    id: string;
    companyName?: string;
    invoiceNumber: string;
    itemDesc: string;
    Amount: number;
    Vat: number;
    totalAmount: number;
    invoicePath: string;
    proofPath: string;
    validity: Validity;
}

export interface Validity {
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
