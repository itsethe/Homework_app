import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import ICAL from "ical.js";

export default function URL_page({ navigation, route }) {
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Small helper: clean + basic validate
  const normalizeLink = (raw) => (raw || "").trim();

  // Optional: nicer date formatting in logs
  const formatDate = (d) => {
    try {
      return d.toLocaleString();
    } catch {
      return String(d);
    }
  };

  async function print_assignments() {
    const url = normalizeLink(link);

    if (!url) {
      Alert.alert("Missing link", "Paste your Brightspace .ics link first.");
      return;
    }

    if (!url.toLowerCase().includes(".ics")) {
      Alert.alert("Doesn't look like an .ics feed", "Make sure the link ends with .ics");
      // still allow it to run if you want — return to block, or remove return to allow
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "text/calendar, text/plain, */*",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const icsText = await res.text();
      if (!icsText || !icsText.includes("BEGIN:VCALENDAR")) {
        throw new Error("Response was not an iCalendar (.ics) file.");
      }

      const jcalData = ICAL.parse(icsText);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents("vevent");

      if (!vevents.length) {
        console.log("No events found in this calendar feed.");
        Alert.alert("No events found", "The feed loaded, but it didn't contain any events.");
        return;
      }

      console.log(`Found ${vevents.length} events. Printing: "Assignment - Due Date"`);

      vevents.forEach((v) => {
        const event = new ICAL.Event(v);

        const assignmentName = event.summary || "Untitled";

        // Brightspace often uses DTEND as the "due" time; fallback to DTSTART if needed.
        const dueJSDate = event.endDate
          ? event.endDate.toJSDate()
          : event.startDate
          ? event.startDate.toJSDate()
          : null;

        const dueDate = dueJSDate ? formatDate(dueJSDate) : "No due date";

        console.log(`${assignmentName} - ${dueDate}`);
      });
    } catch (err) {
      console.error("Error reading calendar:", err);
      Alert.alert(
        "Couldn't load calendar",
        String(err?.message || err)
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Link"
        placeholderTextColor="grey"
        value={link}
        onChangeText={setLink}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[styles.submit_link_cont, isLoading && styles.disabled]}
        onPress={print_assignments}
        disabled={isLoading}
      >
        <Text style={styles.submit_button}>
          {isLoading ? "Loading..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    height: 44,
    paddingHorizontal: 10,
  },
  submit_link_cont: {
    backgroundColor: "#75909C",
    padding: 10,
    marginTop: 20,
    height: 40,
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  submit_button: {
    color: "white",
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
});
