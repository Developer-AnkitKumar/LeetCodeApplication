// import { submitBatch, pollbatchResults } from "../utils/judge0.js";
import { getJudge0LanguageId } from "../lib/judge0.lib.js";

export const createProblem = async (req, res) => {
    const { title, discription, difficulty, tag, example, constraints, testcases,
        codeSnippets, referenceSoluction } = req.body;

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "You are not allowed to create problem" });
    }

    try {
        for (const [language, soluctionCode] of Object.entries(referenceSoluction)) {
            const languageId = getJudge0LanguageId(language);
            if (!languageId) {
                return res.status(400).json({ error: `Language ${language} is not supported` });
            }
            const submission = testcases.map(({ input, output }) => ({
                source_code: soluctionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }));

            const submissionResult = await submitBatch(submission);
            const tokens = submissionResult.map((res) => (res.token));

            const result = await pollbatchResults(tokens);
            for (let i = 0; i < result.length; i++) {
                const result = result[i];
                if (result.status.id !== 3) {
                    return res.status(400).json({ error: `Test case ${i + 1} failed for language ${language}` });
                }
            }
            const newProblem = await db.problem.create({
                data:{
                    title,
                    discription,
                    difficulty,
                    tag,
                    example,
                    constraints,
                    testcases,
                    codeSnippets,
                    referenceSoluction,
                    userId: req.user.id,
                }
            });
            return res.status(201).json(newProblem);
        };
    } catch (error) {
        res.status(500).json({ error: "Error creating problem" });
    }
};
export const getAllProblems = async (req, res) => { }

export const getProblemById = async (req, res) => { }

export const updateProblem = async (req, res) => { }

export const deleteProblem = async (req, res) => { }

export const getSolvedProblems = async (req, res) => { }