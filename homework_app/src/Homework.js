import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ICAL from "ical.js";

export default function Homework({ navigation }) {
  const [activeTab, setActiveTab] = useState("past");
  const [assignments, setAssignments] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSavedAssignments();
  }, []);

  async function loadSavedAssignments() {
    try {
      const saved = await AsyncStorage.getItem("assignments");
      if (saved) setAssignments(JSON.parse(saved));
    } catch (e) {
      console.log("Load error:", e);
    }
  }

  function parseAssignmentsFromIcsText(icsText) {
    const jcalData = ICAL.parse(icsText);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    return vevents
      .map((v) => {
        const event = new ICAL.Event(v);

        const title = event.summary || "Untitled";

        const dueJSDate = event.endDate
          ? event.endDate.toJSDate()
          : event.startDate
          ? event.startDate.toJSDate()
          : null;

        if (!dueJSDate) return null;

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
  }

  async function refreshFromSavedLink() {
    const url = await AsyncStorage.getItem("ics_link");
    if (!url) {
      Alert.alert("No saved link", "Go back and submit your .ics link first.");
      return;
    }

    setIsRefreshing(true);

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

      const newAssignments = parseAssignmentsFromIcsText(icsText);

      setAssignments(newAssignments);
      await AsyncStorage.setItem("assignments", JSON.stringify(newAssignments));
    } catch (err) {
      Alert.alert("Refresh failed", String(err?.message || err));
    } finally {
      setIsRefreshing(false);
    }
  }

  const { pastDue, dueNextWeek, upcoming } = useMemo(() => {
    const now = new Date();
    const oneWeekFromNow = new Date(now);
    oneWeekFromNow.setDate(now.getDate() + 7);

    const pastDue = [];
    const dueNextWeek = [];
    const upcoming = [];

    for (const a of assignments) {
      const dueDate = new Date(a.due);

      if (dueDate < now) pastDue.push(a);
      else if (dueDate <= oneWeekFromNow) dueNextWeek.push(a);
      else upcoming.push(a);
    }

    return { pastDue, dueNextWeek, upcoming };
  }, [assignments]);

  const data =
    activeTab === "past" ? pastDue : activeTab === "week" ? dueNextWeek : upcoming;

  const formatDue = (iso) => new Date(iso).toLocaleString();

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.topRow}>
        <Text style={styles.title}>Homework</Text>

        <TouchableOpacity
          style={[styles.refreshBtn, isRefreshing && styles.disabled]}
          onPress={refreshFromSavedLink}
          disabled={isRefreshing}
        >
          <Text style={styles.refreshText}>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <Text>Past Due</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "week" && styles.activeTab]}
          onPress={() => setActiveTab("week")}
        >
          <Text>Due Next Week</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text>Upcoming</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ marginTop: 14 }}>No assignments here.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("AssignmentDetails", { assignment: item })}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDue}>Due: {formatDue(item.due)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "bold" },

  refreshBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#75909C",
    borderRadius: 8,
  },
  refreshText: { color: "white", fontWeight: "600" },
  disabled: { opacity: 0.6 },

  tabs: { flexDirection: "row", marginBottom: 10 },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 6,
    marginHorizontal: 3,
  },
  activeTab: { backgroundColor: "#cde1ff" },

  item: {
    padding: 12,
    backgroundColor: "#f4f4f4",
    marginBottom: 10,
    borderRadius: 8,
  },
  itemTitle: { fontWeight: "700", marginBottom: 4 },
  itemDue: { color: "#444" },
});
