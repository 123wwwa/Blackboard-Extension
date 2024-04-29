import pdfToText  from "react-pdftotext";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
export const pdfToTexts = async (url: string) => {
    const file = await fetch(url)
        .then(res => res.blob())
        .catch(error => console.error(error))
    const text = await pdfToText(file);
    return text;
}
export const pdfToTextList = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch PDF');
    }
    const file = await response.blob();
    const blobUrl = URL.createObjectURL(file);
    const loadingTask = pdfjs.getDocument(blobUrl);
    let extractedTextList = [];
    let hadParsingError = false;
    let pageNums = 0;
    try {
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            extractedTextList.push(pageText);
        }
        pageNums = numPages;
    } catch (error) {
        hadParsingError = true;
        console.error("Error extracting text from PDF:", error);
    } finally {
        URL.revokeObjectURL(blobUrl);
        loadingTask.destroy();
    }

    if (!hadParsingError) {
        return {
            text: extractedTextList,
            numPages: pageNums
        }
    } else {
        return null; // or throw an error, or handle accordingly
    }
};
export const pdfToPageText = async (url) => {
    const file = await fetch(url).then((res) => res.blob())

    // Create a blob URL for the PDF file
    const blobUrl = URL.createObjectURL(file)

    // Load the PDF file
    const loadingTask = pdfjs.getDocument(blobUrl)

    let extractedText = ""
    let hadParsingError = false
    const pdf = await loadingTask.promise
    const numPages = pdf.numPages
    try {
        let num = 1;
        // Iterate through each page and extract text
        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber)
            const textContent = await page.getTextContent()
            const pageText = textContent.items.map((item:any) => item.str).join(" ");
            extractedText += `**Page ${num}**\n`
            extractedText += pageText
            num += 1;
        }
    } catch (error) {
        hadParsingError = true
        console.error("Error extracting text from PDF:", error)
    }

    // Clean up the blob URL
    URL.revokeObjectURL(blobUrl)

    // Free memory from loading task
    loadingTask.destroy()
    
    if (!hadParsingError) {
        return {
            text: extractedText,
            numPages: numPages
        }
    }
}