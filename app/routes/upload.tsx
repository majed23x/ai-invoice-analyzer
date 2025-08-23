import React, {type FormEvent, useState} from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";
const Upload =  () => {
    const { auth , isLoading, fs, ai ,kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [statusText, setStatusText] = React.useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);


    }


    const handleAnalyze = async ({companyName, invoiceNumber, itemDesc, file} :  { companyName: string, invoiceNumber: string, itemDesc: string, file: File}): Promise<void> => {
        setIsProcessing(true);
        setStatusText("Uploading the file...")
        const uploadedFile = await fs.upload([file])

        if(!uploadedFile) return setStatusText('Error: Failed to upload File');

        setStatusText('Converting to image....');
        const imageFile = await convertPdfToImage(file)
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image')
        const uploadedImage = await fs.upload([imageFile.file])
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...')

        const uuid = generateUUID();
        const data = {
            id: uuid,
            invoicePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName: companyName,invoiceNumber,itemDesc,
            feedback: '',
        }
        await kv.set(`invoice:${uuid}`, JSON.stringify(data))
        setStatusText("Analyzing.....")

        const feedback: AIResponse | undefined = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({companyName, invoicePurpose: itemDesc,invoiceNumber})

        )
        if(!feedback) return setStatusText('Error: Failed to Analyze invoice data ');


        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text

            data.feedback = JSON.parse(feedbackText)
            await kv.set(`invoice:${uuid}`, JSON.stringify(data))
            setStatusText("Analysis Complete, redirecting...")
            console.log(data)

    }


    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("companyName") as string
    const invoiceNumber = formData.get("invoiceNumber") as string
    const itemDesc = formData.get("itemDesc") as string

    if(!file) return;

    handleAnalyze({companyName, invoiceNumber, itemDesc,file})


    }
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for Invoices</h1>
                    {isProcessing ? (
                        <>
                        <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className={`w-full`} />
                        </>
                    ) : (
                        <h2>Drop you invoices for detailed Validation and identify Fraduelent Transactions</h2>
                    )}
                </div>
                {!isProcessing && (
                  <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                      <div className="form-div">
                    <label htmlFor="company-name">Company Name</label>
                        <input type="text" name="companyName" placeholder="Company Name" />
                      </div>
                      <div className="form-div">
                          <label htmlFor="invoice-number">Invoice Number </label>
                          <input type="text" name="invoiceNumber" placeholder="Invoice Number" />
                      </div>
                      <div className="form-div">
                          <label htmlFor="invoice-description">Invoice Description </label>
                          <textarea  rows={5} name="itemDesc" placeholder="Invoice Description" />
                      </div>

                      <div className="form-div">
                          <label htmlFor="uploader">Upload Invoice </label>
                          <FileUploader onFileSelect={handleFileSelect} />
                          <button type="submit" className="primary-button">Submit</button>
                      </div>

                  </form>
                )}

            </section>
            </main>
    )
}


export default Upload;