import React from 'react';
import type { Invoice } from "../../types";
import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

const InvoiceCard = ({ invoice }: { invoice: Invoice }) => {
    const { id, companyName, invoiceNumber, Amount, Vat, validity,invoicePath } = invoice;

    return (
        <Link to={`/invoice/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
            <div className="flex flex-col gap-2">
                <h2 className="text-black font-bold break-words">
                     {companyName}
                </h2>
                <h3 className="text-lg break-words text-gray-500">
                    Invoice Number: {invoiceNumber}
                </h3>
                <p className="text-gray-600">Amount: AED {Amount}</p>
                <p className="text-gray-600">VAT: AED {Vat}</p>
            </div>

            <div className="flex-shrink-0 mt-4">
                <ScoreCircle score={validity.overallScore} />
            </div>
            </div>
            <div className="gradient-border animate-in fade-in duration-1000">
            <div className="w-full h-full">
                <img
                src={invoicePath}
                alt="invoice"
                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"

                />
            </div>
            </div>
        </Link>
    );
};

export default InvoiceCard;
