import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/Colors";
import { formatDate } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface TransactionItemProps {
  item: {
    id: number;
    user_id: string;
    title: string;
    amount: string;
    category: string;
    created_at: string;
  };
  onDelete: (id: number) => void;
}

const CATEGORY_ITEMS: Record<string, string> = {
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "car",
  Entertainment: "film",
  Bills: "receipt",
  Income: "cash",
  Other: "ellipsis-horizontal",
};
export const TransactionItem = ({ item, onDelete }: TransactionItemProps) => {
  const isIncome = parseFloat(item.amount) > 0;
  const iconName = (CATEGORY_ITEMS[item.category] ||
    "pricetag-outline") as keyof typeof Ionicons.glyphMap;

  return (
    <View style={styles.transactionCard}>
      <TouchableOpacity style={styles.transactionContent}>
        <View style={styles.categoryIconContainer}>
          <Ionicons
            name={iconName}
            size={22}
            color={isIncome ? COLORS.income : COLORS.expense}
          />
        </View>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isIncome ? COLORS.income : COLORS.expense },
            ]}
          >
            {isIncome ? "+" : "-"}₹
            {Math.abs(parseFloat(item.amount)).toFixed(2)}
          </Text>
          <Text style={styles.transactionDate}>
            {formatDate(item.created_at)}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={22} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );
};
