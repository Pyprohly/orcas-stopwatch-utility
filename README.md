
# Orcas Stopwatch Utility

## Synopsis

This web app is intended to assist marshalling operations in a sports social
session at a particular venue, because its utility is derived from the specific
layout of the stopwatches.

For developers, the repository serves as a demonstration of how theming could
be done in a React application when both dark and light mode must be supported.

## User Manual

### Stopwatch Component

At the bottom of the component are the start/stop and reset buttons for the
stopwatch.

When the stopwatch is started, the reset button is swapped with two
buttons—'-20s' and '+20s'—which decrement and increment the stopwatch timer by
20 seconds, respectively.

On the top right there are two toggleable flags—the amber flag and the green
flag—which illuminate on press. Aside from that, they have no functionality.

As the stopwatch progresses, the background of the component depicts a radial
wipe animation effect. It forms a complete circle at 15 minutes.

* Press `P` to stop all stopwatches.

* Press `C` to reset all stopwatches.

* Press `Y`, or swipe up and hold on mobile, to open the theme picker.

### Operation Instructions

It is recommended you start the stopwatch as close as possible to the time the
game starts, rather than immediately after making a marshalling announcement
for that court. The flags can be used to help this alignment.

The amber flag may be used as a 'court is scheduled' reminder. Upon making a
'court next' announcement, engage the amber flag. Then, when you notice the new
game has begun, start the stopwatch and disengage the amber flag.

The green flag may be used as a 'court is vacated' indicator. Upon making a
'court now' announcement, stop the stopwatch for that court, engage the green
flag, then attend to the magnet board. Once you notice the new game has begun,
start the stopwatch and disengage the green flag, then attend to the magnet
board.
