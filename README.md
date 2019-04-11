# Train Scheduler
A Train scheduler with Firebase DB backend

## Calculations to Consider
- The duration between the start time and current time in minutes
- Take the duration as the dividend, and the frequency is the divisor
- Subtract the outcome of the modulo operation above with the frequency
  - e.g. `Math.abs((duration % frequency) - frequency)`
  - `Math.abs()` will always ensure a positive value
  - This calculation will give you how long the next train will arrive in minutes
- Using MomentJS, you can use the calculation above to add on top of the current time to determine the time of the next train
### Important note about `startTime`
- A method of `subtract()` in the MomentJS library was added in order to calculate the duration properly, i.e. `subtract(1, "years")`

## CSS Framework
Tachyons was used as a CSS Framework: https://tachyons.io. No overrides necessary!

## MomentJS is awesome
https://momentjs.com/ made working with times/dates convenient. Sure, StackOverflow helped cut through the documentation and steer in the right direction 😎 MomentJS' built-in methods made it easy to compare and determine between start and end times.

## Improvements/TODOs
- Input validation: only  accept appropriate values such as strings or integers only
- Style the schedule to mimic the split-flap display? https://en.wikipedia.org/wiki/Split-flap_display