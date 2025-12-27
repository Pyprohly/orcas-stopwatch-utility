
# Orcas Stopwatch Utility

## Synopsis

This web app assists marshalling operations in a sports social session for a
particular venue. Its utility is derived from the specific layout of the
stopwatches.

For developers, the repository serves as a demonstration of how theming could
be done in a React application when both dark and light mode must be supported.

## User Manual

### Stopwatch Component

At the bottom of the component are the start/stop and reset buttons for the
stopwatch.

The reset button is replaced with two buttons—'-20s' and '+20s'—which decrement
and increment the stopwatch timer by 20 seconds, respectively.

On the top right there are two flags—the amber flag and the green flag—which
illuminate on press. Aside from that, they have no functionality.

As the stopwatch progresses, the background of the component depicts a radial
wipe animation effect. It forms a complete circle at 15 minutes.

* Press `P` to stop all stopwatches.

* Press `C` to reset all stopwatches.

* Press `Y`, or swipe up and hold on mobile, to open the theme picker.

### Operation Instructions

It is recommended that you start the stopwatch as close as possible to the time
the game starts, rather than immediately after a marshalling announcement. The
flags can be used to help with this.

Upon making an 'await court' announcement, stop the stopwatch for that court
and engage the amber flag, then attend to the magnet board. When you notice the
new game has begun, start the stopwatch and disengage the amber flag.

Upon making a 'court now' announcement, stop the stopwatch for that court and
engage the green flag. When you notice the new game has begun, start the
stopwatch and disengage the green flag, then attend to the magnet board.
