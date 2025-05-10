export const getJudge0LanguageId = (language) => {
    const languageMap = {
        'python': 71,
        'javascript': 63,
        'java': 62,
        'c++': 54,
        'c#': 51,
        'ruby': 72,
        'go': 66,
        'php': 73,
        'swift': 70,
        'typescript': 74,
    };
    return languageMap[language.toUpperCase()] || null;
}

export const pollbatchResults = async (tokens) => {
    while (true) {
        const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch/?token=${tokens.join(',')}&base64_encoded=false`);
        
        const results = data.submissions;

      const isAllDone = results.every(
        (r) => r.status.id !== 1 && r.status.id != 2  
      )
      if(isAllDone) return results
      await StylePropertyMap(1000);
    }
};

export const submitBatch = async (submissions) => {
    const { data } = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
        submissions
    });
    console.log("Submission result: ", data);
    return data;
};
