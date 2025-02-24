// scripts.js
import { popupContent } from './popupData.js';


document.addEventListener("DOMContentLoaded", () => {
    const credentials = document.querySelectorAll(".credential li");
    const careers = document.querySelectorAll(".career li");
    let lastClickedElement = null; // Track the last clicked element

    // Function to handle click event
    function handleClick(event) {
        event.stopPropagation();
        const targetElement = event.currentTarget; // Always use the currentTarget

        // Clear any previous selections
        document.querySelectorAll(".credential li, .career li").forEach((el) => {
            el.classList.remove("clicked");
            el.classList.remove("selected");
        });

        // Add the class to the clicked element
        targetElement.classList.add("clicked");
        targetElement.classList.add("selected");

        // Store clicked element
        lastClickedElement = targetElement;

        // Create popup and adjust arrows
        createPopup(targetElement);
        realignArrows(); // Realign arrows immediately on click
    }

    // Add event listeners to credentials and careers
    credentials.forEach((element) => {
        element.addEventListener("click", handleClick);
    });
    careers.forEach((element) => {
        element.addEventListener("click", handleClick);
    });

    // Create popup on click
    function createPopup(element) {
        // Remove any existing popups
        const existingPopup = document.querySelector(".popup");
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement("div");
        popup.classList.add("popup");

        const content = document.createElement("div");
        content.classList.add("popup-content");
        content.innerHTML = popupContent[element.id]?.content || "No information available";
        popup.appendChild(content);

        const learnMoreButton = document.createElement("button");
        learnMoreButton.textContent = "Learn More";
        learnMoreButton.addEventListener("click", (event) => {
            event.stopPropagation();
            window.open(popupContent[element.id]?.link || "#", "_blank");
        });
        popup.appendChild(learnMoreButton);

        const rect = element.getBoundingClientRect();
        popup.style.top = `${rect.bottom + window.scrollY}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;
        popup.style.width = `${rect.width}px`;

        // Stop propagation when clicking on the popup itself
        popup.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        document.body.appendChild(popup);
    }


    // Reset popup
    function resetPopup() {
        const existingPopup = document.querySelector(".popup");
        if (existingPopup) {
            existingPopup.remove();
        }
    }

    function resetUI() {
        // Reset all elements
        credentials.forEach((c) => {
            c.classList.remove("selected");
            c.classList.remove("disabled");

        });
        careers.forEach((c) => {
            c.classList.remove("selected");
            c.classList.remove("disabled");

        });

        // Clear all arrows from the SVG
        const svg = document.getElementById("arrows");
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // Re-append the arrowhead marker (if necessary)
        const marker = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "marker"
        );
        marker.setAttribute("id", "arrowhead");
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "0");
        marker.setAttribute("refY", "3.5");
        marker.setAttribute("orient", "auto");
        const arrowhead = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "polygon"
        );
        arrowhead.setAttribute("points", "0 0, 10 3.5, 0 7");
        arrowhead.setAttribute("fill", "black");
        marker.appendChild(arrowhead);
        svg.appendChild(marker);

    }

    // Function to realign arrows for the selected element only
    function realignArrows() {
        const svg = document.getElementById("arrows");
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // Add back the arrowhead marker
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "arrowhead");
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "0");
        marker.setAttribute("refY", "3.5");
        marker.setAttribute("orient", "auto");

        const arrowhead = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        arrowhead.setAttribute("points", "0 0, 10 3.5, 0 7");
        arrowhead.setAttribute("fill", "black");
        marker.appendChild(arrowhead);
        svg.appendChild(marker);

        // Only realign arrows for the last clicked element
        if (lastClickedElement) {
            const relatedItems = lastClickedElement.dataset.related.split(",");
            relatedItems.forEach((itemId) => {
                const itemElement = document.getElementById(itemId);
                if (itemElement) {
                    if (lastClickedElement.closest(".credential")) {
                        drawArrowFromCertificateToCareer(lastClickedElement, itemElement);
                    } else {
                        drawCircularArrows(lastClickedElement, relatedItems);
                    }
                }
            });
        }
    }

    // Function to realign popups for the selected element only
    function realignPopups() {
        const popup = document.querySelector(".popup");
        if (popup && lastClickedElement) {
            const rect = lastClickedElement.getBoundingClientRect();
            popup.style.top = `${rect.bottom + window.scrollY}px`;
            popup.style.left = `${rect.left + window.scrollX}px`;
            popup.style.width = `${rect.width}px`;
        }
    }

    // Add event listener for window resize
    window.addEventListener('resize', () => {
        // Check if the lastClickedElement is still selected before realigning
        if (lastClickedElement && lastClickedElement.classList.contains("selected")) {
            realignArrows();
            realignPopups();
        }
    });


   function drawArrowFromCertificateToCareer(fromElement, toElement) {
    const svg = document.getElementById("arrows");
    const svgRect = svg.getBoundingClientRect();
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    // Calculate points with offset
    const gap = 10; // Gap between arrow and elements
    let fromX, fromY, toX, toY;

    // Check if screen width is less than 400px
    if (window.innerWidth < 400) {
        // New logic: Arrow from top of fromElement to left of toElement
        fromX = fromRect.left + fromRect.width / 2 - svgRect.left; // Top center of fromElement
        fromY = fromRect.top - svgRect.top - gap; // Top of fromElement
        toX = toRect.left - svgRect.left - gap; // Left of toElement
        toY = toRect.top + toRect.height / 2 - svgRect.top; // Center of toElement
    } else {
        // Original logic: Arrow from right of fromElement to left of toElement
        fromX = fromRect.right - svgRect.left + gap;
        fromY = fromRect.top + fromRect.height / 2 - svgRect.top;
        toX = toRect.left - svgRect.left - gap;
        toY = toRect.top + toRect.height / 2 - svgRect.top;
    }

    const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

    // Enhanced curve control points
    const deltaX = toX - fromX;
    const controlX1 = fromX + deltaX * 0.25;
    const controlX2 = fromX + deltaX * 0.75;

    const pathData = `M ${fromX} ${fromY} 
                 C ${controlX1} ${fromY},
                   ${controlX2} ${toY},
                   ${toX} ${toY}`;

    arrow.setAttribute("d", pathData);
    arrow.setAttribute("fill", "none");
    arrow.setAttribute("stroke", "black");
    arrow.setAttribute("stroke-width", "1");
    arrow.setAttribute("marker-end", "url(#arrowhead)");

    svg.appendChild(arrow);
}

    function drawCircularArrows(fromCareer, credentialIds) {
        const svg = document.getElementById("arrows");
        const svgRect = svg.getBoundingClientRect();
        const careerRect = fromCareer.getBoundingClientRect();

        // Sort credentials by their vertical position
        const sortedCredentials = credentialIds
            .map((id) => document.getElementById(id))
            .filter((el) => el !== null)
            .sort(
                (a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top
            );

        // Create a function to check if two elements are alternatives
        function areAlternatives(elem1, elem2) {
            // Check if elements have the 'data-alternative' attribute
            const alternatives1 = elem1.dataset.alternative ? elem1.dataset.alternative.split(',') : [];
            const alternatives2 = elem2.dataset.alternative ? elem2.dataset.alternative.split(',') : [];

            return alternatives1.includes(elem2.id) || alternatives2.includes(elem1.id);
        }

        // Draw arrows between credentials
        for (let i = 0; i < sortedCredentials.length - 1; i++) {
            const fromRect = sortedCredentials[i].getBoundingClientRect();
            const toRect = sortedCredentials[i + 1].getBoundingClientRect();

            // Calculate midpoint for the "or" text
            const midX = (fromRect.left + toRect.left) / 2 - svgRect.left + fromRect.width / 2;
            const midY = (fromRect.bottom + toRect.top) / 2 - svgRect.top;

            // Check if these elements are alternatives
            if (areAlternatives(sortedCredentials[i], sortedCredentials[i + 1])) {
                // Create "OR" circle element
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", midX);
                circle.setAttribute("cy", midY);
                circle.setAttribute("r", 25); // Radius of the circle
                circle.setAttribute("fill", "#000000"); // Background color

                // Create "OR" text element
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("x", midX);
                text.setAttribute("y", midY + 4); // Adjust position to center text vertically
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("dominant-baseline", "middle");
                text.setAttribute("fill", "white"); // Text color
                text.setAttribute("font-size", "20px");
                text.setAttribute("class", "arrow-text");
                text.textContent = "O  R";

                // Append circle and text to SVG
                svg.appendChild(circle);
                svg.appendChild(text);
            }

            const arrow = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );
            arrow.setAttribute(
                "x1",
                fromRect.left - svgRect.left + fromRect.width / 2
            );
            arrow.setAttribute("y1", fromRect.top - svgRect.top - 2);
            arrow.setAttribute("x2", toRect.left - svgRect.left + toRect.width / 2);
            arrow.setAttribute("y2", toRect.bottom - svgRect.top + 8);
            arrow.setAttribute("stroke", "black");
            arrow.setAttribute("stroke-width", "1");
            arrow.setAttribute("marker-end", "url(#arrowhead)");

            svg.appendChild(arrow);
        }

 // Draw arrow from last credential to career
if (sortedCredentials.length > 0) {
    const lastCredRect =
        sortedCredentials[sortedCredentials.length - 1].getBoundingClientRect();

    let fromX, fromY;

    // Check if the screen width is less than 400px (mobile screen)
    if (window.innerWidth <= 400) {
        // Adjust fromX to be 3/4 of the width from the left of the element
        fromX = lastCredRect.left + (lastCredRect.width * 0.75) - svgRect.left;
        // Adjust fromY to be the top of the element
        fromY = lastCredRect.top - svgRect.top;
    } else {
        // Original logic for larger screens
        fromX = lastCredRect.right - svgRect.left + 2;
        fromY = lastCredRect.top + lastCredRect.height / 2 - svgRect.top;
    }

    const toX = careerRect.left - svgRect.left - 10;
    const toY = careerRect.top + careerRect.height / 2 - svgRect.top;

    const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    const midX = (fromX + toX) / 2;
    const pathData = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;

    arrow.setAttribute("d", pathData);
    arrow.setAttribute("fill", "none");
    arrow.setAttribute("stroke", "black");
    arrow.setAttribute("stroke-width", "1");
    arrow.setAttribute("marker-end", "url(#arrowhead)");

    svg.appendChild(arrow);
}
    }


    // Add event listeners to credentials
    credentials.forEach((credential) => {
        credential.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent click event from propagating to the document

            // Reset all elements
            resetUI();

            // Highlight the selected credential and disable others
            credential.classList.add("selected");
            credentials.forEach((c) => {
                if (c !== credential) {
                    c.classList.add("disabled");
                }
            });

            // Highlight related careers and disable others
            highlightRelatedItems(credential, careers, "related"); // Highlight related careers
            careers.forEach((c) => {
                if (!c.classList.contains("selected")) {
                    // Disable unselected careers
                    c.classList.add("disabled");
                }
            });
        });
    });

    // Add event listeners to careers
    careers.forEach((career) => {
        career.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent click event from propagating to the document

            // Reset all elements
            resetUI();

            // Highlight the selected career and disable others
            career.classList.add("selected");
            careers.forEach((c) => {
                if (c !== career) {
                    c.classList.add("disabled");
                }
            });

            // Retrieve related credentials from the data-related attribute
            const relatedCredentials = career.dataset.related.split(",");

            // Draw the circular arrows from career to credentials and back
            drawCircularArrows(career, relatedCredentials);

            // Highlight related credentials and disable others
            relatedCredentials.forEach((credentialId) => {
                const credential = document.getElementById(credentialId);
                if (credential) {
                    credential.classList.add("selected");
                }
            });

            credentials.forEach((c) => {
                if (!c.classList.contains("selected")) {
                    c.classList.add("disabled");
                }
            });
        });
    });

    function highlightRelatedItems(selectedItem, _items, dataAttribute) {
        const relatedItems = selectedItem.dataset[dataAttribute].split(",");

        // Highlight related items
        relatedItems.forEach((itemId) => {
            const itemElement = document.getElementById(itemId);
            if (itemElement) {
                itemElement.classList.remove("disabled");
                itemElement.classList.add("selected");
                if (selectedItem.closest(".credential")) {
                    drawArrowFromCertificateToCareer(selectedItem, itemElement);
                } else {
                    drawCircularArrows(selectedItem, relatedItems);
                }
            }
        });
    }


    // Function to realign the language selection box
    // function positionLanguageSelectionBox() {
    //     const tableRect = tableContainer.getBoundingClientRect();
    //     languageSelectionBox.style.position = 'absolute';
    //     languageSelectionBox.style.top = `${tableRect.top + window.scrollY - languageSelectionBox.offsetHeight - 10}px`;
    //     languageSelectionBox.style.left = `${tableRect.right + window.scrollX - languageSelectionBox.offsetWidth}px`;
    // }

    // Initial positioning and on resize
    // positionLanguageSelectionBox();
    // window.addEventListener("resize", positionLanguageSelectionBox);

    // Reposition on language change
    // const observer = new MutationObserver(positionLanguageSelectionBox);
    // observer.observe(document.body, { attributes: true, childList: true, subtree: true });


    // document.addEventListener("click", resetUI);

    // Add event listener to reset popup when clicking anywhere on the window
    window.addEventListener("click", () => {
        resetUI();
        resetPopup();
    });

    // Add this event listener to the document to close the popup when clicking outside
    document.addEventListener("click", (event) => {
        if (
            !event.target.closest(".popup") &&
            !event.target.closest(".credential li") &&
            !event.target.closest(".career li")
        ) {
            resetUI();
        }
    });
    // Add event listener for window resize
    // window.addEventListener("resize", resetUI);
    // window.addEventListener("resize", resetPopup);
});