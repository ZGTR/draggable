// eslint-disable-next-line import/no-unresolved
import {Sortable, Plugins, StackedListItem} from '@shopify/draggable';

const Classes = {
  startDragging: 'draggable-container-parent--start-dragging',
  draggable: 'StackedListItem--isDraggable',
  capacity: 'draggable-container-parent--capacity',
};

export default function MultipleContainers() {
  const containers = document.querySelectorAll('#MultipleContainers .StackedList');

  if (containers.length === 0) {
    return false;
  }

  const sortable = new Sortable(containers, {
    draggable: `.${Classes.draggable}`,
    mirror: {
      constrainDimensions: true,
    },
    plugins: [Plugins.ResizeMirror],
  });

  let containerStoryCapacity = 3;
  let containerStory = sortable.containers[0];
  let containerStoryParent = containerStory.parentNode;

  let containerUserElements = sortable.containers[1];
  let userElementsMenuItems = { 'items': ["Text", "Image", "Audio", "AbstractEvent"] };

  let containerBotlements = sortable.containers[2];

  let currentStoryChildren;
  let capacityReached;
  let lastOverContainer;

  // --- Draggable events --- //
  sortable.on('drag:start', (evt) => {
    console.log("start:" + JSON.stringify(lastOverContainer));
    currentStoryChildren = sortable.getDraggableElementsForContainer(containerStory).length;
    capacityReached = currentStoryChildren === containerStoryCapacity;
    lastOverContainer = evt.sourceContainer;
    if(!capacityReached)
      containerStoryParent.classList.toggle(Classes.startDragging, true);
    else
      containerStoryParent.classList.toggle(Classes.capacity, capacityReached);
  });

  sortable.on('sortable:sort', (evt) => {
    console.log("sort");
    if (!capacityReached) 
      return;

    const sourceIsCapacityContainer = evt.dragEvent.sourceContainer === containerStory;

    if (!sourceIsCapacityContainer && evt.dragEvent.overContainer === containerStory) {
      evt.cancel();
    }
  });

  sortable.on('sortable:sorted', (evt) => {
    console.log("sorted");
    if (lastOverContainer === evt.dragEvent.overContainer)
      return;

    lastOverContainer = evt.dragEvent.overContainer;
  });

  sortable.on('drag:stop', (evt) => {
    let currentItem = evt.data.source;
    let containerFrom = evt.data.sourceContainer;
    let containerTo = lastOverContainer;

    if (containerTo.id === 'StoryUl')
      draggingToStoryContainer(currentItem, containerFrom, containerTo);

  });

  var draggingToStoryContainer = function(currentItem, containerFrom, containerTo)
  {
    // Handling reordering of items in StoryUl
    if (containerTo === containerFrom)
    {
      return;
    }

    // Set the element back to its origin
    ensureUserElements();
    // ensureBotElements();
    // containerFrom.insertBefore(currentItem, containerFrom.children[0]);
  }

  var ensureUserElements = function()
  {
    var model = { 'items': ["Text", "Image", "Audio", "AbstractEvent"] };
    var html = '';

    while (containerUserElements.firstChild) {
        containerUserElements.removeChild(containerUserElements.firstChild);
    }

    for (var i = 0; i < model.items.length; i++) {
      var itemName = model.items[i];
      var item = new StackedListItem(itemName, {index: i, draggable: true});
      containerUserElements.appendChild(item);  
    }
  }

  return sortable;
}
