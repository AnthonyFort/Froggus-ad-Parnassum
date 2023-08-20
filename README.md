# Froggus-ad-Parnassum

## Introduction

This was my first ever project, undertaken and completed in the 4th week of the General Assembly Software Engineering Immersive (August 2023). The brief was to recreate a classic grid-based game using JavaScript, HTML, and CSS, and to render it in the browser. I recreated Frogger (1981), but added a twist so that it doubles up as a musical improvisation training tool. This was a solo project. 

In classic Frogger, the aim of the game is to move one frog from one end of the grid to the other, avoiding obstacles along the way. In Froggus ad Parnassum, the player moves two frogs at the same time, one with each hand, not only avoiding obstacles (sharks), but ensuring that the frogs remain specific widths apart, according to certain rules. In doing so, the player achieves two things. Firstly, by playing with two hands at once, the player simulates playing a piano. In fact, I assigned each key a musical note so that the player does indeed produce musical sound. Secondly, by maintaining an appropriate width between frogs, the resulting musical harmony abides (with one caveat) by certain rules laid out in Johann Joseph Fux’s famous compositional treatise ‘Gradus ad Parnassum’ (1725). 

## Overview

Part of Fux’s Gradus ad Parnassum takes the student through a series of exercises in a topic called ‘counterpoint.’ Counterpoint trains the student to think carefully about which musical note to play alongside another musical note. Suppose you’re playing the piano and you play one note in the right hand and another note simultaneously in the left. The musical effect you create from the combination of those two notes will vary depending on how wide apart those notes are from one another. Counterpoint trains the student to follow certain rules that are central to the classical music style. Fux arranged his exercises into levels called ‘species’. Froggus ad Parnassum simulates the first level, or ‘first species counterpoint.’ The following sequence of screenshots walks through a possible winning play:

![Sequence of screenshots walks through a possible winning play]

Each frog begins on a lily pad, then leaps into the water, dodging sharks on every row until they reach the last two sets of lily pads on the other side. In the original Frogger, the player can move the frog both vertically and horizontally. In Froggus ad Parnassum, the frogs will automatically be moved up one row with each new move. The player’s job is to decide where they are positioned horizontally, using the key guide above the grid to help them. 

At the start, the frogs span a width of 8 keys (making sure to count the keys on which the frogs themselves are positioned). The frogs adopt the same width on the final row. This is in accordance Fux’s rule that voices in first species should begin and end 8 notes apart. Similarly, following another Fuxian rule, in the second to last row, the player must land on the lily pads that are aligned with the ‘f’ key and ‘l’ key respectively.

In the middle rows, there is more choice, but there are still constraints. Generally, in these rows, the width between the frogs should be either 3 keys or 6 keys. Fux did permit the occasional use of a 5-key width and an 8-key width in the middle (see stage 5 in the example above). In Froggus ad Parnassum, players are allowed to do this ONCE in the middle rows, but any more times and they will lose the game.

To encourage quick thinking (which is an important skill in the mastery of musical improvisation), players are timed from the moment they play the first move. The top ten fastest times are added to a leaderboard.

## Document and Reflecting on the Planning Process

In preparation for this project, I produced a five-and-a-half-page planning document for my instructors to review, which is reproduced as an appendix to this README. In this plan, I fleshed out the concept of the game, using wireframes made on figma.com. I also anticipated various technical challenges and provided initial normal-language solutions for them. 

Ultimately, the final concept remained the same as the plan, except for one subtle but significant difference. In the planning stages, I wanted to build the game such that the player was forced to play “in time”, by following either a visual or audio metronome. The motivation behind this was that I wanted to simulate musical playing as much as possible, and keeping good time is, of course, an important aspect of playing musically. However, even though I did in fact build a function to encourage metronomic playing, I ended up discarding it and replacing it with a ‘high score’ feature that encouraged players not to play metronomically but instead to complete the game as quickly as possible. Not only did I find this more fun (and more addictive), but I felt it could also help develop another important musical skill, which is the ability to think ahead and to think quickly.

On the coding front, technical challenges I had anticipated and discussed in the plan for the most part had solutions that were broadly similar to the ones I had outlined, although, in practice, these solutions often turned out to be more complex (and interesting!) than I had expected. Some of these solutions will be discussed in more detail below.
