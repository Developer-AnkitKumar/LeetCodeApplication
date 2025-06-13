import { pollbatchResults } from "../lib/judge0.lib.js";

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
                console.log("Result----", result);
                           
                if (result.status.id !== 3) {
                    return res.status(400).json({ error: `Test case ${i + 1} failed for language ${language}` });
                }
            }
            const newProblem = await db.problem.create({
                data: {
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

export const getAllProblems = async (req, res) => {
    try {
        const problem = await db.problem.findMany();
            if(!problem){
                return res.status(404).json({ error: "No problems found" });
            }
        return res.status(200).json({
            success: true,
            message: "All problems fetched successfully",
            problem
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error fetching problems" });
    }
};

export const getProblemById = async (req, res) => {
    const { id } = req.params;
    try {
        const problem = await db.problem.findUnique({
            where: { id: parseInt(id) }
        });
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Problem fetched successfully",
            problem
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error fetching problem by id" });
    }
}

export const updateProblem = async (req, res) => {
    const { id } = req.params; // hm is problem ko is ID se phchanege
    const { title, discription, difficulty, tag, example, constraints, testcases,
        codeSnippets, referenceSoluction } = req.body;

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "You are not allowed to update problem" });
    }

    try {
        const updatedProblem = await db.problem.update({
            where: { id: parseInt(id) },
            data: {
                title,
                discription,
                difficulty,
                tag,
                example,
                constraints,
                testcases,
                codeSnippets,
                referenceSoluction
            }
        });
        return res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            updatedProblem
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error updating problem" });
    }
}

export const deleteProblem = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "You are not allowed to delete problem" });
    }

    try {
        const deletedProblem = await db.problem.delete({
            where: { id: parseInt(id) }
        });
        return res.status(200).json({
            success: true,
            message: "Problem deleted successfully",
            deletedProblem
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error deleting problem" });
    }
}

export const getSolvedProblems = async (req, res) => { 
}