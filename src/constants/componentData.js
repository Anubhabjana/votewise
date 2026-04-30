export const QUIZ_QUESTIONS = [
  {
    question: "Who is responsible for administering elections in the country?",
    options: ["The Supreme Court", "The Election Commission", "The Prime Minister's Office", "The Parliament"],
    correctIndex: 1,
    explanation: "The Election Commission is an autonomous constitutional authority responsible for administering election processes."
  },
  {
    question: "What is the minimum voting age for a citizen?",
    options: ["16", "18", "21", "25"],
    correctIndex: 1,
    explanation: "The voting age was lowered from 21 to 18 years by the 61st Amendment Act."
  },
  {
    question: "What does EVM stand for?",
    options: ["Election Voting Mechanism", "Electronic Voting Machine", "Electoral Verification Method", "Elected Voter Mandate"],
    correctIndex: 1,
    explanation: "EVM stands for Electronic Voting Machine, which replaced paper ballot systems."
  },
  {
    question: "What is the purpose of NOTA on the EVM?",
    options: ["To cancel the election", "To request a recount", "To express disapproval of all candidates", "To vote for multiple candidates"],
    correctIndex: 2,
    explanation: "NOTA (None of the Above) gives voters the right to reject all candidates in their constituency."
  },
  {
    question: "Which document is officially required as proof of identity at the polling booth?",
    options: ["Library Card", "Employment ID", "Voter ID (EPIC)", "Electricity Bill"],
    correctIndex: 2,
    explanation: "While other documents may be accepted, Voter ID (EPIC - Electors Photo Identity Card) is the primary document."
  },
  {
    question: "What happens if there is a tie between two candidates?",
    options: ["A re-election is held", "The winner is decided by drawing lots", "The older candidate wins", "Both share the term"],
    correctIndex: 1,
    explanation: "In the rare event of a tie, the Returning Officer decides the winner by drawing lots."
  },
  {
    question: "How is a country typically divided for electoral purposes?",
    options: ["Districts", "States", "Constituencies", "Zones"],
    correctIndex: 2,
    explanation: "A country is divided into territorial constituencies, each electing one representative."
  },
  {
    question: "Can a person currently confined in prison vote?",
    options: ["Yes, unconditionally", "Yes, but only via postal ballot", "No, except under preventive detention", "No, never"],
    correctIndex: 2,
    explanation: "A person confined in prison cannot vote, but a person under preventive detention can."
  },
  {
    question: "What is the VVPAT machine used for?",
    options: ["Printing candidate posters", "Verifying that the vote cast on EVM is recorded correctly", "Registering new voters", "Counting total votes"],
    correctIndex: 1,
    explanation: "Voter Verifiable Paper Audit Trail (VVPAT) helps voters verify their vote was recorded as cast."
  },
  {
    question: "When does the 'Model Code of Conduct' come into effect?",
    options: ["On the day of voting", "One month before voting", "Immediately when the election schedule is announced", "After the results are declared"],
    correctIndex: 2,
    explanation: "It comes into force immediately upon the announcement of the election schedule by the Election Commission."
  }
];

export const MYTHS = [
  {
    myth: "My single vote doesn't matter anyway.",
    fact: "Many elections have been decided by incredibly small margins — sometimes even 1 or 2 votes! Every single vote shapes the future."
  },
  {
    myth: "I can't vote because I'm away from my home constituency.",
    fact: "You must vote where you are registered. If you moved, you must update your voter registration to your current address using Form 8."
  },
  {
    myth: "Electronic Voting Machines (EVMs) can be easily hacked.",
    fact: "EVMs are standalone, non-networked machines with stringent physical and technical security protocols to prevent tampering."
  },
  {
    myth: "If my name isn't on the voter slip given by political parties, I can't vote.",
    fact: "Your name MUST be on the official Electoral Roll. A slip from a party does not guarantee your right to vote if you aren't on the roll."
  },
  {
    myth: "NOTA (None of the Above) is a wasted vote.",
    fact: "NOTA allows voters to express their discontent with all candidates. High NOTA votes send a strong statistical message to political parties."
  }
];

export const ELECTION_PHASES = [
  {
    title: "Voter Registration",
    description: "Ensure your name is on the electoral roll. You can apply using Form 6 online or offline.",
    simpleDescription: "Get your name on the official voter list using Form 6.",
    icon: "ClipboardCheck"
  },
  {
    title: "Election Announcement",
    description: "The Election Commission announces the dates. The Model Code of Conduct comes into effect immediately.",
    simpleDescription: "Election dates are announced and strict rules apply to all parties.",
    icon: "Megaphone"
  },
  {
    title: "Candidate Nominations",
    description: "Candidates file their nomination papers, which are then scrutinized.",
    simpleDescription: "People who want to be leaders submit their paperwork.",
    icon: "FileSignature"
  },
  {
    title: "Campaign Period",
    description: "Political parties campaign to win over voters. This ends 48 hours before polling begins.",
    simpleDescription: "Parties try to win your vote. This stops 2 days before voting day.",
    icon: "Users"
  },
  {
    title: "Voting Day",
    description: "Registered voters cast their vote at designated polling stations using EVMs.",
    simpleDescription: "You go to the polling booth and press the button on the machine to vote.",
    icon: "Vote"
  },
  {
    title: "Counting & Results",
    description: "EVMs are opened under tight security, votes are counted, and results are declared.",
    simpleDescription: "Votes are counted and the winners are announced.",
    icon: "BarChart3"
  }
];

export const BOOTH_STEPS = [
  {
    title: "1. Show Your ID",
    text: "Present your Voter ID (EPIC) or an approved ID document to the First Polling Officer. They will verify your identity."
  },
  {
    title: "2. Indelible Ink",
    text: "The Second Polling Officer will mark your left forefinger with indelible ink to prevent duplicate voting."
  },
  {
    title: "3. Sign the Register",
    text: "You will sign or provide a thumb impression in the electoral register (Form 17A)."
  },
  {
    title: "4. Receive Voter Slip",
    text: "You'll receive a slip reflecting your serial number. Hand this to the Third Polling Officer."
  },
  {
    title: "5. Enter Compartment",
    text: "Proceed to the voting compartment. Only you are allowed inside to ensure ballot secrecy."
  },
  {
    title: "6. Press 'Vote' on EVM",
    text: "Press the blue button on the Electronic Voting Machine (EVM) next to your chosen candidate or NOTA."
  },
  {
    title: "7. Verify with VVPAT",
    text: "Check the VVPAT machine window. A printed slip showing your candidate's name will appear for 7 seconds, then drop into the box."
  },
  {
    title: "8. Exit the Booth",
    text: "You have successfully voted! Exit the polling station peacefully."
  }
];

export const SUGGESTED_QUESTIONS = [
  "How to register to vote?",
  "What is an EVM?",
  "How to check my name in the voter list?",
  "What if I don't have a Voter ID?"
];

export const DEMO_CHAT = [
  { role: 'ai', content: "Hello! I'm VoteWise, your AI election assistant. How can I help you understand the voting process today?" },
  { role: 'user', content: "How to register to vote?" },
  { role: 'ai', content: "You can register to vote by filling out Form 6 online via the Voter Portal (voters.eci.gov.in) or offline through your local Booth Level Officer." }
];
