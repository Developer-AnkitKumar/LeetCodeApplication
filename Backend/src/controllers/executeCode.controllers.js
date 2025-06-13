import { pollbatchResults, submitBatch } from '../lib/judge0.lib.js';

export const executeCode = async (req, res) => {
    try {
        const { sourceCode, languageId, stdin, expectedOutputs, problemId } = req.body;
        res.status(200).json({
            message: 'Code executed successfully',
            sourceCode,
            languageId,
            stdin,
            expectedOutputs,
            problemId
        });

        const userId = req.user.id; 

        if(
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expectedOutputs) ||
            expectedOutputs.length !== stdin.length
        )
        {
            return res.status(400).json({ error: 'Invalid or missing testCases data' });
        }

        const submission = stdin.map((input) => ({
            userId,
            problemId,
            languageId,
            sourceCode,
            stdin: input,
            base64_encoded: false
        }));
        res.status(200).json({
            message: 'Code executed successfully',
            submission
        });

        const submitResponse = await submitBatch(submission)
        if (!submitResponse || submitResponse.length === 0) {
            return res.status(500).json({ error: 'Failed to submit code' });
        }
        const token = submitResponse.map((res) => res.token);
        res.status(200).json({
            message: 'Code submitted successfully',
            token
        });

        const results = await pollbatchResults(token);
        if (!results || results.length === 0) {
            return res.status(500).json({ error: 'Failed to retrieve results' });
        }

        console.log('executed---------', results);
        console.log(results);

        res.status(200).json({
            message: 'Code executed successfully',
            results
        });
    } catch (error) {
        console.error('Error executing code:', error);
        res.status(500).json({ error: 'Failed to execute code' });
    }
}