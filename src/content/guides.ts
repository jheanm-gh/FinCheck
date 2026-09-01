/**
 * Lead magnets (§26).
 *
 * DELIBERATE REFRAME: these are lists of QUESTIONS, not recommendations.
 *
 * A checklist saying "you should have six months of expenses saved" is financial
 * advice published under the name of a licensed representative, without an advice
 * process and without compliance review. A checklist saying "ask how many months your
 * savings would actually cover" is an agenda for a conversation, which is exactly what
 * this site is for and carries none of that risk.
 *
 * Everything here still needs Harika's review before launch, but nothing here asserts
 * a financial fact or recommends an action.
 */

export interface Guide {
  slug: string;
  title: string;
  blurb: string;
  /** What someone gets, stated plainly so the gate is honest. */
  contains: string;
  leadIntent: string;
  sections: { heading: string; questions: string[] }[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'annual-review',
    title: 'Annual financial review',
    blurb: 'What to go through once a year, and what to ask about each thing.',
    contains: '21 questions across five areas',
    leadIntent: 'review_existing_cover',
    sections: [
      {
        heading: 'Cover you already hold',
        questions: [
          'What would each policy actually pay out, and to whom?',
          'When was each one last reviewed?',
          'Which of them are through my employer, and what happens if I leave?',
          'Are the premiums escalating, and by how much each year?',
        ],
      },
      {
        heading: 'What changed this year',
        questions: [
          'Did my income change enough to matter?',
          'Did anyone join or leave the household?',
          'Did I take on new debt, or clear any?',
          'Did I change jobs, or is a change coming?',
        ],
      },
      {
        heading: 'Money set aside',
        questions: [
          'How many months of essentials would my accessible savings cover?',
          'Am I still contributing what I think I am contributing?',
          'What is my money actually invested in?',
          'What am I paying in fees, in rands rather than percentages?',
        ],
      },
      {
        heading: 'Paperwork',
        questions: [
          'Is my will current, and does anyone know where it is?',
          'Do my beneficiary nominations still say what I intend?',
          'Does anyone know what I hold and where?',
          'Are my details current with every provider?',
        ],
      },
      {
        heading: 'To raise with an adviser',
        questions: [
          'What am I paying you, and how are you paid?',
          'Which product suppliers do you represent?',
          'What would you look at first in my situation?',
          'What are you not able to advise on?',
          'What happens to my file if you stop practising?',
        ],
      },
    ],
  },
  {
    slug: 'new-parent',
    title: 'New parent financial checklist',
    blurb: 'What a new dependant changes, framed as things to check.',
    contains: '16 questions across four areas',
    leadIntent: 'providing_for_children',
    sections: [
      {
        heading: 'The first month',
        questions: [
          'Is the child on my medical aid, and from what date?',
          'What did registering them change about my cover?',
          'Do I know what my maternity or paternity benefit actually pays?',
          'What does the household run on while income is reduced?',
        ],
      },
      {
        heading: 'If something happened to me',
        questions: [
          'Who would raise this child, and is that written down anywhere?',
          'What would the household need each month without my income?',
          'Does my existing cover reflect a dependant who did not exist when I took it out?',
          'Who is the beneficiary on each policy and retirement fund?',
        ],
      },
      {
        heading: 'The long horizon',
        questions: [
          'What is education likely to cost by the time it starts?',
          'What am I saving toward it now, if anything?',
          'Is that saving in something suited to an eighteen-year horizon?',
          'What happens to it if I stop contributing for a year?',
        ],
      },
      {
        heading: 'Paperwork',
        questions: [
          'Is my will updated to include this child?',
          'Have I nominated a guardian?',
          'Is there a trust, and does it need one?',
          'Does my partner know where all of this is kept?',
        ],
      },
    ],
  },
  {
    slug: 'changing-jobs',
    title: 'Changing jobs',
    blurb: 'What quietly stops when you resign, and what to ask before you do.',
    contains: '14 questions across three areas',
    leadIntent: 'employer_benefit_uncertainty',
    sections: [
      {
        heading: 'What ends with the job',
        questions: [
          'What group life, disability and severe illness cover do I currently have through my employer?',
          'Does any of it continue after my last day?',
          'Can I convert any of it to a personal policy, and by when?',
          'What does my medical aid arrangement depend on?',
        ],
      },
      {
        heading: 'The retirement fund',
        questions: [
          'What are my options for the fund balance?',
          'What are the tax consequences of each option?',
          'What would withdrawing cost me, in tax and in lost growth?',
          'What fees apply to each destination?',
        ],
      },
      {
        heading: 'The new job',
        questions: [
          'What cover does the new employer provide, and from when?',
          'Is there a waiting period, and am I exposed during it?',
          'What is the employer contribution to retirement, and is it on top of my salary or inside it?',
          'Is there a gap between the two jobs where I have no cover at all?',
          'What did I have before that the new package does not replace?',
          'Who do I tell about the change?',
        ],
      },
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
