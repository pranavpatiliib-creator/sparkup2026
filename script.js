const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbxq12Qr5Qc4G7nhN81O7NTHxzNM77M9csLjC2nfblDzWIIAhTXrU0Y1c_9Qrfk8NamH/exec";

const feedbackForm = document.getElementById("feedbackForm");
const successMessage = document.getElementById("successMessage");

if (feedbackForm && successMessage) {
  const eventChoices = Array.from(
    feedbackForm.querySelectorAll('input[name="eventParticipated"]')
  );

  const validateEventChoices = () => {
    const hasAtLeastOne = eventChoices.some((choice) => choice.checked);
    const message = hasAtLeastOne ? "" : "Please select at least one event.";
    eventChoices.forEach((choice) => choice.setCustomValidity(message));
    return hasAtLeastOne;
  };

  eventChoices.forEach((choice) => {
    choice.addEventListener("change", () => {
      if (choice.value === "None" && choice.checked) {
        eventChoices.forEach((other) => {
          if (other !== choice) other.checked = false;
        });
      } else if (choice.checked) {
        const noneChoice = eventChoices.find((item) => item.value === "None");
        if (noneChoice) noneChoice.checked = false;
      }

      validateEventChoices();
    });
  });

  feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    validateEventChoices();

    if (!feedbackForm.checkValidity()) {
      feedbackForm.reportValidity();
      return;
    }

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) submitBtn.disabled = true;

    const selectedEvents = eventChoices
      .filter((choice) => choice.checked)
      .map((choice) => choice.value)
      .join(", ");

    const formData = new FormData(feedbackForm);
    const payload = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (key === "eventParticipated") continue;
      payload.append(key, value.toString());
    }

    payload.append("eventParticipated", selectedEvents);

    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        body: payload
      });

      feedbackForm.classList.add("hidden");
      successMessage.classList.remove("hidden");
      feedbackForm.reset();
    } catch (error) {
      alert("Submission failed. Please try again.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
