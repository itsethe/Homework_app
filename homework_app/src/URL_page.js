import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ICAL from "ical.js";

export default function URL_page({ navigation }) {
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const normalizeLink = (raw) => (raw || "").trim();

  function parseAssignmentsFromIcsText(icsText) {
    const jcalData = ICAL.parse(icsText);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    const assignments = vevents
      .map((v) => {
        const event = new ICAL.Event(v);

        const title = event.summary || "Untitled";

        // Brightspace often uses DTEND as due, fallback to DTSTART
        const dueJSDate = event.endDate
          ? event.endDate.toJSDate()
          : event.startDate
          ? event.startDate.toJSDate()
          : null;

        if (!dueJSDate) return null;

        // ✅ Pull description from common fields
        const description =
          event.description ||
          v.getFirstPropertyValue("description") ||
          v.getFirstPropertyValue("x-alt-desc") ||
          "";

        const id = String(event.uid || `${title}-${dueJSDate.getTime()}`);

        return {
          id,
          title,
          due: dueJSDate.toISOString(),
          description: String(description),
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.due) - new Date(b.due));

    return assignments;
  }

  async function onSubmit() {
    const url = normalizeLink(link);

    if (!url) {
      Alert.alert("Missing link", "Paste your Brightspace .ics link first.");
      return;
    }

    if (!url.toLowerCase().includes(".ics")) {
      Alert.alert(
        "Doesn't look like an .ics feed",
        "Make sure the link ends with .ics"
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "text/calendar, text/plain, */*" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

      const icsText = await res.text();
      if (!icsText || !icsText.includes("BEGIN:VCALENDAR")) {
        throw new Error("Response was not an iCalendar (.ics) file.");
      }

      const assignments = parseAssignmentsFromIcsText(icsText);

      if (!assignments.length) {
        Alert.alert("No events found", "The feed loaded, but had no events.");
        return;
      }

      // ✅ SAVE LOCALLY
      await AsyncStorage.setItem("assignments", JSON.stringify(assignments));
      await AsyncStorage.setItem("ics_link", url);

      navigation.navigate("Homework");
    } catch (err) {
      Alert.alert("Couldn't load calendar", String(err?.message || err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Brightspace ICS Import</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Brightspace .ics Link"
        placeholderTextColor="grey"
        value={link}
        onChangeText={setLink}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[styles.submit_link_cont, isLoading && styles.disabled]}
        onPress={onSubmit}
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
  container: { padding: 20 },
  header: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "black",
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  submit_link_cont: {
    backgroundColor: "#75909C",
    padding: 10,
    marginTop: 20,
    height: 44,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  submit_button: { color: "white", fontWeight: "600" },
  disabled: { opacity: 0.6 },
});
