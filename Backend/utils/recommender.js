const matchSkills = (userSkills, targetSkills) => {
    const missing = targetSkills.filter(skill => !userSkills.includes(skill));
    return missing;
  };
  
  module.exports = { matchSkills };
  