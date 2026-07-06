export interface Story {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  paragraphs: string[];
}

// Original Taglish short stories (English with a few Tagalog words) used as
// one-tap examples so people can read or hear the reader before opening a PDF
// of their own. Paragraphs are re-paginated by word count when loaded.
export const STORIES: readonly Story[] = [
  {
    id: 'sana',
    title: 'Sana',
    tag: 'Heartbreak',
    blurb: 'A boy, a confession he never made, and the empty seat where she used to be.',
    paragraphs: [
      `Miguel had loved Dahlia for exactly three years, four months, and eleven days, though he had never once said it out loud. He counted the way other people counted savings, quietly, hopefully, certain that one day the total would be enough to buy the thing he wanted most. And what he wanted was simple. He wanted to sit across from her and say four small words before the courage left him again.`,
      `It was always the same in the mornings. He arrived at the university library twenty minutes early, not to study, but to claim the seat that faced the entrance, so he could watch her come in. Dahlia always paused at the door to shake the rain from her umbrella, a pale yellow one with a bent rib she refused to replace. She would tuck a loose strand of hair behind her ear, scan the room without really looking for anyone, and take the seat by the tall window where the light was kindest.`,
      `He knew her the way you know a song you have played too many times. Two sugars, no cream. A habit of underlining sentences she liked, then apologizing to the book. The small frown she wore when a problem refused to solve itself, and the way that frown broke into something bright when it finally did. He knew everything about her except the one thing that mattered, which was how to begin.`,
      `Sana, he would tell himself. Tomorrow, sana. Tomorrow I will bring her a coffee and I will not run away. He rehearsed it in the bathroom mirror at night, four words polished smooth as river stones. But every morning the sentence arrived at his lips and dissolved there like sugar in the rain, and every morning he told himself that tomorrow the total would finally be enough.`,
      `There were near misses. Once, she asked to borrow his pen, and their fingers touched, and he forgot the entire language he had been born speaking. Once, they were the last two people in the library at closing, and she smiled at him and said, ang tahimik, so quiet, and he nodded like a fool who had lost the word for yes. Once, he wrote a letter and folded it into his bag and carried it for a week until the creases went soft, and then he carried it another week, and then he stopped carrying it because carrying it hurt less than giving it.`,
      `He told himself he had time. That was the lie that felt most like the truth. He believed that people you love simply stay where you left them, waiting on the other side of your courage, patient as furniture. He believed the seat by the window would always be filled by the girl with the yellow umbrella, and that his tomorrow would always be there, folded neatly, waiting to be spent.`,
      `Then one Monday the seat by the window was empty.`,
      `He waited. He told himself she was only late, that the rain had slowed her, that any moment now the door would open and she would shake her umbrella and the morning would resume its familiar shape. The door opened many times that day. It was never her. It was never her the next day either, or the day after that.`,
      `It was a classmate who finally told him, offhand, the way people deliver the news that will undo you as if it were the weather. Her family had moved abroad over the weekend. A father's job, a sudden visa, a decision made quickly and quietly the way some goodbyes happen, without anyone getting the chance to say them. She was gone. There had been no last day, because no one had known it was the last day. That was the cruelest part. He had spent his final morning with her exactly the way he had spent all the others, watching, waiting, saving up, and it had turned out to be the end, and he had let it pass like nothing.`,
      `Sana pala, he thought, and the words tasted like rust. Sana pala nagsalita ako. If only I had spoken. He understood, too late, that courage is not a savings account. It does not grow safely in the dark. It is a fruit, and fruit left unpicked does not wait for you. It falls, and it feeds the ground, and the ground says nothing back.`,
      `Miguel still goes to the library. He still takes the seat that faces the door. Some mornings, without quite deciding to, he buys two coffees, two sugars in one of them, and he sets the second cup across from him where the light is kindest, and he lets it go cold. It is a foolish thing to do. He knows this. But it is the only confession he has left, and he makes it every morning to an empty chair, four small words he can finally say now that there is no one to hear them.`,
      `Mahal kita, he tells the chair. I loved you the whole time. Sana. Sana nga.`,
    ],
  },
  {
    id: 'hintay',
    title: 'Hintay',
    tag: 'Longing',
    blurb: 'Every Friday, the same bench, and a promise that keeps a man waiting through the seasons.',
    paragraphs: [
      `There is a bench, third from the fountain in the old plaza, where a man named Emil sits every Friday afternoon. He is not old, not yet, though the waiting has begun to age him in the way that only waiting can, from the inside, quietly.`,
      `Two winters ago, on that exact bench, a girl named Rosa fell asleep on his shoulder. They had been talking since noon about everything and nothing, the way you can only talk with someone who has slipped past all your careful gates without your noticing. When she woke, embarrassed, she laughed and said she had never felt safe enough to fall asleep next to anyone before. Emil kept very still for the rest of the afternoon, the way you hold your breath around something you do not want to frighten away.`,
      `But Rosa's family was from the province, and the city had only ever been a place she was passing through. When the time came for her to go back, she held both his hands at the bus terminal and made him a promise. Antay lang, she said. Wait for me. I will come back before the trees lose their leaves. Emil promised he would wait. It was the easiest promise he had ever made.`,
      `The trees have lost their leaves twice now.`,
      `Every Friday he buys two servings of taho from the vendor who sets up near the fountain, warm soy pudding with sago and syrup, because it was the thing Rosa loved most about the city. He eats one. The other he holds for a while, and then he gives it to a child, or a stranger, or the pigeons, because a promise you keep alone still needs somewhere to go.`,
      `The taho vendor, an old man named Mang Ige, has learned Emil's face and his sadness. For a long time he said nothing, only poured two cups and took the coins. But one cold Friday, when the wind had emptied the plaza of everyone but the two of them, he finally asked. Bakit ka pa naghihintay, iho? Why do you still wait? Do you even know if she is coming back?`,
      `Emil considered the question honestly, because it deserved honesty. He did not know. There had been letters at first, then fewer letters, then a silence that had lasted long enough to become its own kind of answer. He was not a stupid man. He understood what silence usually meant. And yet.`,
      `Because a promise is a kind of home, he wanted to say. Because if I stop waiting, then the best afternoon of my life becomes just a thing that happened once, and I am not ready to let it be only that. Because hoping is the last room in the house where she still lives, and I am not ready to turn off the light.`,
      `But those were too many words for a cold day, so Emil only smiled and said, hindi ko alam. I do not know. But I will know less if I stop. Mang Ige nodded slowly, the way old men nod at things they have survived, and he poured a third cup that Friday, for himself, and the two of them sat and watched the fountain and said nothing more.`,
      `Somewhere out past the plaza, a bus is always arriving. Emil hears them in the distance, the long sigh of the brakes, and every time, for one foolish and luminous second, he lets himself believe. Maybe this Friday. Maybe she shook the leaves from her own calendar and finally came. He is almost certainly wrong. He knows this. Hintay pa, he tells himself anyway, and settles deeper into the bench. Just a little longer. Just one more Friday. I can always wait one more.`,
    ],
  },
  {
    id: 'paalam',
    title: 'Paalam',
    tag: 'Goodbye',
    blurb: 'An airport, a boarding call, and all the words that arrived too late.',
    paragraphs: [
      `The departure board at the airport blinked her flight from a possibility into a fact. Gate 14. Now boarding. Ligaya read it three times, as if reading might soften it, and held her boarding pass with both hands so it would not see them shaking.`,
      `Across the row of hard plastic chairs sat Ramon, who had driven her to the airport because she had asked him to and because he had never once, in six years, been able to tell her no. Six years of being almost. Almost together, almost honest, almost brave enough to name the thing that had been sitting between them the whole time, patient and enormous, like a piece of furniture in a room too small for it.`,
      `They had met as students, kept meeting as the years rearranged them, orbited each other through other people's weddings and other people's heartbreaks. Everyone assumed. Their friends had long ago stopped teasing and started worrying. Kailan ba kayo? When are the two of you finally going to happen? And they would laugh it off, the two of them, because laughing was easier than admitting how badly they both wanted the answer to be soon.`,
      `But soon is a country with no roads leading to it. You cannot arrive there by waiting. And now the waiting had run out, because a job Ligaya could not refuse was calling her to the other side of the world, and there was no version of the future where she stayed and no version where he asked her to.`,
      `The intercom called the final boarding for Gate 14. Her name was somewhere inside that announcement, folded into a language that suddenly sounded like nothing but leaving.`,
      `She stood. He stood. For one terrible moment they simply faced each other, six years thick, and every unspoken sentence Ramon had ever swallowed rose up all at once and pressed against his teeth. Say it, some small animal in his chest begged him. Say it now or carry it forever. Sabihin mo na.`,
      `Paalam, Ligaya said first, and the word broke somewhere in the middle, the way ice breaks, without warning and all at once. Goodbye.`,
      `Ramon opened his mouth. And here is the thing he would replay for the rest of his life, in the shower, in traffic, in the blue hour before sleep. He had the words ready. Mahal kita. Wag kang umalis. I love you. Do not go. They were right there, finally, fully formed. But he looked at her face, at the ticket already taking her somewhere better, at the life waiting for her that he had no right to interrupt, and he loved her too much to make her choose. So instead he said, ingat ka. Take care of yourself.`,
      `Something in her eyes flickered, some door she had held open just a crack, and then, gently, closed. She nodded. She turned. She walked toward the gate without looking back, because she knew, the way you know your own heartbeat, that if she turned around she would stay, and staying had never been enough for either of them, and she deserved a life that was more than almost.`,
      `The gate closed. The plane pushed back. Ramon sat down slowly in the hard plastic chair, in the sudden enormous quiet, and only then, to no one, to the empty seat still warm from where she had been, did he finally say it. Mahal kita, he whispered. Paalam. I loved you the whole six years. I am sorry I only ever said it to the air.`,
    ],
  },
  {
    id: 'tadhana',
    title: 'Tadhana',
    tag: 'Kilig',
    blurb: 'Two strangers, one broken jeepney, and a rain that refused to stop.',
    paragraphs: [
      `The jeepney died in the middle of the flood, and so did the last of Andres's patience.`,
      `It had been a spectacularly bad day, the kind that seems personally designed by the universe. He had missed one deadline, been shouted at over another, and stepped into a puddle that turned out to be knee deep. Now the rain was coming down like the sky had a grudge, the jeepney's engine had drowned somewhere along the flooded avenue, and he was wedged shoulder to shoulder with a dozen strangers, all of them wet, all of them silent, all of them wearing the specific misery of commuters who have simply run out of complaints.`,
      `And then a girl climbed in, laughing.`,
      `She was as soaked as anyone, her hair plastered to her face, her shoes clearly ruined, and she was laughing, actually laughing, shaking the water from her hands like she was flicking away confetti. Ang lakas ng ulan, ano? she said to no one and everyone, grinning. The rain is really showing off today. A few of the strangers smiled despite themselves. Andres, who had been rehearsing a truly world class bad mood, felt it slip embarrassingly out of his grip.`,
      `She sat across from him because it was the only space left. Up close she had a small scar through one eyebrow and the kind of eyes that seemed to be enjoying a private joke about the whole world. Bad day? she asked him, reading his face with alarming ease. Andres started to say no out of pride, then looked down at his ruined shoes and his ruined deadlines and laughed, really laughed, for the first time in what felt like weeks. The worst, he admitted. Genuinely the worst. Good, she said. Then it can only get better. That is just math.`,
      `They talked while the water rose past the wheels. Her name was Liwayway, which means dawn, and she said her mother had chosen it hoping she would be the kind of person who made dark things brighter, and then she made a face like she found the responsibility exhausting and wonderful in equal measure. She had opinions about everything, taho versus ice cream, the correct way to eat green mango, whether the rain was romantic or merely wet. Andres, who usually rationed his words like they cost him money, found himself spending them freely, recklessly, gloriously.`,
      `The engine coughed. Sputtered. Caught. The jeepney lurched back to life and the spell of the stalled hour began, cruelly, to end. This was his stop coming up. This was the moment where strangers become strangers again.`,
      `Give me your number, he said, too fast, too plainly, his heart entirely without a plan. Liwayway smiled. She reached over and, with one finger, wrote seven digits on the fogged glass of the window beside him. He stared at them, memorizing, and in the second he looked down to fumble for his phone, she wiped them away with her palm, laughing softly.`,
      `Hoy, he protested. Why? Because, she said, gathering her ruined shoes as the jeepney slowed, if this is tadhana, then we will meet again anyway, and you will not need it. And if it is not, then a number would only be a way of arguing with the truth. She hopped down into the shallow end of the flood, turned once, and called up to him, kung para sa iyo, babalik at babalik. If something is meant for you, it comes back, and it comes back. Then she was gone into the gray curtain of the rain.`,
      `This is a foolish way to run a heart, and Andres knew it. But for the next three weeks he rode that same jeepney line, past his stop, through every flood the city could throw at him, watching every door, hoping. His friends said he was crazy. Maybe. But he had stopped believing the day was against him. Some people would call what he was waiting for luck, or coincidence, or nothing at all. Andres had a different word for it, a word a girl had drawn on a window and wiped away, trusting it to survive without ink. Tadhana, daw. Let it be fate. He could wait for fate. He had the whole rainy season, and for the first time in a long while, he was not miserable in the rain. He was just early.`,
    ],
  },
  {
    id: 'muli',
    title: 'Muli',
    tag: 'Second chance',
    blurb: 'Ten years later, the same corner, and a heart that still remembers.',
    paragraphs: [
      `They met again at the corner of the old bookstore, ten years and one entire lifetime after they had promised, at that same corner, never to see each other again.`,
      `Clara almost walked past him. She had become an expert, over the years, at not seeing him, at scrubbing his shape out of crowds and coffee shops and the backs of buses. But he said her name, just once, the old way, with the little upward turn at the end like a question he already knew the answer to, and ten years of careful forgetting came apart in a single second.`,
      `Diego. Older now, a few grey hairs he had not earned gently, a coat she did not recognize. But when he smiled it was the same crooked smile, the one that used to ruin her entire week in the best way, and her traitor of a heart did the exact thing it had done when she was twenty two, which was to forget every good reason it had ever been given.`,
      `Kumusta, he said. How have you been. Such small, ordinary words to lay across a canyon. She wanted to answer honestly. She wanted to tell him about all the versions of herself he had missed, the ones who had cried over him and then the ones who had stopped, the one who got the job in another city, the one who almost married someone kind and did not, the one who had finally, that very spring, forgiven them both for the way it had ended. She wanted to hand him the whole decade at once. Instead she said, mabuti naman. I have been well. And you?`,
      `They had ended badly, the way that only people who love each other too young and too hard can end. There had been a fight neither of them could now fully reconstruct, pride on both sides thick as walls, words said specifically to wound because wounding felt, for one terrible night, like winning. They had been too proud to call, then too ashamed, then simply too late, and the silence had hardened into a decade the way water hardens into stone if you only leave it alone long enough.`,
      `But now they were here, and neither of them was walking away.`,
      `They walked, in fact, without deciding to, falling into the old rhythm the way you fall back into a language you thought you had forgotten. The street had changed around them. The bookstore where they used to hide from the rain was a milk tea shop now, bright and loud. The theater was a parking lot. The city had spent ten years becoming a place that did not remember them. But Diego still laughed at his own jokes a half second early, and Clara still elbowed him for it, and the shape of the two of them walking side by side had survived everything, apparently, including themselves.`,
      `They talked for hours. About the small things first, jobs and cities and the friends who had married and moved away, and then, carefully, about the large thing, the night, the fight, the years. He said sorry and meant it. She said sorry and meant it too, which surprised her, because she had rehearsed for a decade a version of this conversation in which she said nothing of the kind. Patawad, they told each other, the word soft and heavy at once. Forgive me. It turned out they both had been carrying it. It turned out neither of them had ever fully put the other down.`,
      `The evening thinned. A waiter began stacking chairs. It was the moment where the day either ends or begins again, and they both felt it arrive.`,
      `Baka naman, Clara thought, looking at him, this familiar stranger, this stranger she had known better than anyone. Baka naman some stories do not actually end. Baka they only pause, and wait, patient as that corner, for both people to finally be ready at the same time.`,
      `Diego looked at her, and the crooked smile went soft and uncertain, twenty two again. Ulit tayo? he asked, so quietly she felt it more than heard it. Us. Again. Do you think.`,
      `And Clara, who had spent ten years becoming someone who did not need him, discovered that she could be that person and still choose him anyway, that the two were not opposites after all. She did not practice the answer in any mirror. She did not count the cost. Opo, she said, and laughed, and cried a little, and reached for his hand across ten years and one lifetime. Yes. Again. Oo. Ulit.`,
    ],
  },
];
