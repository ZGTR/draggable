// eslint-disable-next-line import/no-unresolved
import {Sortable, Plugins} from '@shopify/draggable';

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

  const containerStoryCapacity = 3;
  const containerStory = sortable.containers[0];
  const containerStoryParent = containerStory.parentNode;

  const containerUserElements = sortable.containers[1];
  const containerBotlements = sortable.containers[2];
  
  let currentStoryChildren;
  let capacityReached;
  let lastOverContainer;

  // --- Draggable events --- //
  sortable.on('drag:start', (evt) => {
    console.log("start");
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

  return sortable;
}
