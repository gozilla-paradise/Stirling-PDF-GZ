package stirling.software.SPDF.controller.api.misc;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import stirling.software.SPDF.config.EndpointConfiguration;
import stirling.software.SPDF.config.swagger.StandardPdfResponse;
import stirling.software.SPDF.model.api.misc.TextOutliningRequest;
import stirling.software.common.annotations.AutoJobPostMapping;
import stirling.software.common.annotations.api.MiscApi;
import stirling.software.common.service.CustomPDFDocumentFactory;
import stirling.software.common.util.GeneralUtils;
import stirling.software.common.util.ProcessExecutor;
import stirling.software.common.util.ProcessExecutor.ProcessExecutorResult;
import stirling.software.common.util.TempFile;
import stirling.software.common.util.TempFileManager;
import stirling.software.common.util.WebResponseUtils;

@MiscApi
@Slf4j
@RequiredArgsConstructor
public class TextOutliningController {

    private final CustomPDFDocumentFactory pdfDocumentFactory;
    private final TempFileManager tempFileManager;
    private final EndpointConfiguration endpointConfiguration;

    private boolean isGhostscriptEnabled() {
        return endpointConfiguration.isGroupEnabled("Ghostscript");
    }

    @AutoJobPostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, value = "/text-outlining")
    @StandardPdfResponse
    @Operation(
            summary = "Convert text to outlines in a PDF",
            description =
                    "Converts all text in a PDF to vector outlines/paths using Ghostscript. "
                            + "This removes font dependencies and makes text non-editable while "
                            + "preserving visual appearance. Useful for ensuring consistent display "
                            + "across different systems. Input:PDF Output:PDF Type:SISO")
    public ResponseEntity<byte[]> textOutlining(@ModelAttribute TextOutliningRequest request)
            throws IOException, InterruptedException {
        MultipartFile inputFile = request.getFileInput();

        if (!isGhostscriptEnabled()) {
            throw new IOException(
                    "Ghostscript is not available. Text outlining requires Ghostscript to be installed and enabled.");
        }

        // Use TempFile with try-with-resources for automatic cleanup
        try (TempFile tempInputFile = new TempFile(tempFileManager, ".pdf");
                TempFile tempOutputFile = new TempFile(tempFileManager, ".pdf")) {

            // Save the uploaded file to the temporary location
            inputFile.transferTo(tempInputFile.getFile());

            // Build Ghostscript command with -dNoOutputFonts flag
            List<String> gsCommand = new ArrayList<>();
            gsCommand.add("gs");
            gsCommand.add("-sDEVICE=pdfwrite");
            gsCommand.add("-dCompatibilityLevel=1.5");
            gsCommand.add("-dNOPAUSE");
            gsCommand.add("-dQUIET");
            gsCommand.add("-dBATCH");
            gsCommand.add("-dNoOutputFonts");
            gsCommand.add("-sOutputFile=" + tempOutputFile.getPath().toString());
            gsCommand.add(tempInputFile.getPath().toString());

            ProcessExecutorResult gsResult =
                    ProcessExecutor.getInstance(ProcessExecutor.Processes.GHOSTSCRIPT)
                            .runCommandWithOutputHandling(gsCommand);

            if (gsResult.getRc() != 0) {
                throw new IOException(
                        "Text outlining failed with Ghostscript. Return code: " + gsResult.getRc());
            }

            // Read the processed PDF file
            byte[] pdfBytes = pdfDocumentFactory.loadToBytes(tempOutputFile.getFile());

            // Return the processed PDF as a response
            return WebResponseUtils.bytesToWebResponse(
                    pdfBytes,
                    GeneralUtils.generateFilename(
                            inputFile.getOriginalFilename(), "_outlined.pdf"));
        }
    }
}
