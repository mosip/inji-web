//package utils;
//
//import org.apache.pdfbox.pdmodel.PDDocument;
//import org.apache.pdfbox.text.PDFTextStripper;
//
//public class PDFContentVerification {
//	
//	public static void main(String[] args) throws Exception {
//        Playwright playwright = Playwright.create();
//        try (Page page = playwright.chromium().launch().newPage()) {
//            // Download your PDF using Playwright actions (navigate to a URL, click a button etc.)
//            String downloadedPdfPath = "//path/to/downloaded/pdf.pdf";
//
//            // Verify PDF content
//            String expectedContent = "Veridonia Insurance\r\n"
//            		+ "Name\r\n"
//            		+ "Aswin\r\n"
//            		+ "Policy Name\r\n"
//            		+ "Talapathy Rasigar Mandram\r\n"
//            		+ "Policy Expires On\r\n"
//            		+ "2033-04-20\r\n"
//            		+ "Policy Issued On\r\n"
//            		+ "2023-04-20\r\n"
//            		+ "Policy Number\r\n"
//            		+ "1234567890\r\n"
//            		+ "Phone Number\r\n"
//            		+ "8220255752\r\n"
//            		+ "Date of Birth\r\n"
//            		+ "2024-01-01\r\n"
//            		+ "Gender\r\n"
//            		+ "Female\r\n"
//            		+ "Benefits\r\n"
//            		+ "No Toll Fee, Free Movie Tickets\r\n"
//            		+ "Email Id\r\n"
//            		+ "santhosdss14@gmail.com";
//            String actualContent = extractTextFromPDF(downloadedPdfPath);
//            verifyContent(expectedContent, actualContent);
//        } finally {
//            playwright.close();
//        }
//    }
//
//    private static String extractTextFromPDF(String pdfPath) throws Exception {
//        PDDocument document = PDDocument.load(pdfPath);
//        PDFTextStripper stripper = new PDFTextStripper();
//        String text = stripper.getText(document);
//        document.close();
//        return text;
//    }
//
//    private static void verifyContent(String expected, String actual) {
//        if (actual.contains(expected)) {
//            System.out.println("Content verification successful!");
//        } else {
//            System.out.println("Content verification failed! Expected: " + expected + ", Actual: " + actual);
//        }
//    }
//
//}
