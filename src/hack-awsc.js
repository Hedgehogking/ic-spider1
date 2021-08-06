// module.exports = function slide (slider) {
//       container = slider.parentNode;

//   var rect = slider.getBoundingClientRect(),
//       x0          = rect.x || rect.left,
//       y0          = rect.y || rect.top,
//       w           = container.getBoundingClientRect().width,
//       x1          = x0 + w,
//       y1          = y0;

//   var mousedown = document.createEvent("MouseEvents");
//   mousedown.initMouseEvent("mousedown", true, true, window, 0,
//       x0, y0, x0, y0, false, false, false, false, 0, null);
//   slider.dispatchEvent(mousedown);

//   var mousemove = document.createEvent("MouseEvents");
//   mousemove.initMouseEvent("mousemove", true, true, window, 0,
//       x1, y1, x1, y1, false, false, false, false, 0, null);
//   slider.dispatchEvent(mousemove);

//   /*var mouseup = document.createEvent("MouseEvents");
//   mouseup.initMouseEvent("mouseup", true, true, window, 0,
//       x1, y1, x1, y1, false, false, false, false, 0, null);
//   slider.dispatchEvent(mouseup);*/
// }

module.exports = async function slide(page, parent, button) {

  function timeout(time) {
    return new Promise((resolve,rejece) => {
      setTimeout(() => {
        resolve()
      }, time);
    })
  }

  const parentBox = await parent.boundingBox();
  const { x, y, width, height } = await button.boundingBox();
  await page.mouse.move(x + width / 2, y + height / 2);
  await page.mouse.down();
  await timeout(500);
  await page.mouse.move(x + 100, y + height / 2 + 2);
  await timeout(645);
  await page.mouse.move(x + 150, y + height / 2 + 5);
  await timeout(728);
  await page.mouse.move(x + 240, y + height / 2 + 1);
  await timeout(816);
  await page.mouse.move(x + parentBox.width, y + height / 2 - 3);
  await page.mouse.up();
}
