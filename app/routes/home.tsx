import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {invoices} from "../../constants";
import InvoiceCard from "~/components/InvoiceCard";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Involyzer" },
    { name: "description", content: "Smart Invoice Analyzer for Smart Customers" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();

  const navigate = useNavigate();
  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  },[auth.isAuthenticated]);
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

  <section className="main-section">
  <div className="page-heading py-16">
  <h1> Track & Analyze your Invoices </h1>
    <h2>Review your invoices using AI-powered detector</h2>
  </div>


    {invoices.length > 0 && (
        <div className="invoices-section">
          {invoices.map((invoice) => (

              <InvoiceCard key={invoice.id} invoice={invoice} />


          ))}
        </div>
    )}

  </section>
  </main>
}
