// eslint-disable-next-line import/no-unresolved
import {Sortable, Plugins} from '@shopify/draggable';

const Classes = {
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
  const containerLimited = sortable.containers[0];
  const containerStoryParent = containerLimited.parentNode;
  let currentMediumChildren;
  let capacityReached;
  let lastOverContainer;

  // --- Draggable events --- //
  sortable.on('drag:start', (evt) => {
    currentMediumChildren = sortable.getDraggableElementsForContainer(containerLimited).length;
    capacityReached = currentMediumChildren === containerStoryCapacity;
    lastOverContainer = evt.sourceContainer;
    containerStoryParent.classList.toggle(Classes.capacity, capacityReached);
  });

  sortable.on('sortable:sort', (evt) => {
    if (!capacityReached) {
      return;
    }

    const sourceIsCapacityContainer = evt.dragEvent.sourceContainer === containerLimited;

    if (!sourceIsCapacityContainer && evt.dragEvent.overContainer === containerLimited) {
      evt.cancel();
    }
  });

  sortable.on('sortable:sorted', (evt) => {
    if (lastOverContainer === evt.dragEvent.overContainer) {
      return;
    }

    lastOverContainer = evt.dragEvent.overContainer;
  });

  return sortable;
}
