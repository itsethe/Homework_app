import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function AssignmentDetails({ route }) {
  const { assignment } = route.params;

  const formatDue = (iso) => new Date(iso).toLocaleString();

  // Brightspace descriptions sometimes contain escaped newlines like \\n
  const cleanDescription = (text) =>
    (text || "")
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n")
      .trim();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{assignment.title}</Text>

      <Text style={styles.due}>Due: {formatDue(assignment.due)}</Text>

      <Text style={styles.sectionTitle}>Details</Text>

      <Text style={styles.description}>
        {cleanDescription(assignment.description) ||
          "No description found in the .ics event."}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  due: { fontSize: 16, color: "#444", marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  description: { fontSize: 15, lineHeight: 22, color: "#333" },
});
