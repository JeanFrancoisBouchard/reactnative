import React, { Component } from 'react';
import { Text, View, Button, TextInput, Picker, Alert, Image } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

class HomeScreen extends Component{
    render() {
        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{height: 50}}>
                    <Text>Laboratoire multi-plateforme</Text>
                </View>
                <View style={{height: 50, width: 225}}>
                    <Button
                        title="Convertisseur de monnaies"
                        onPress={() => this.props.navigation.navigate('Currency')}
                    />
                </View>
                <View style={{height: 50, width: 225}}>
                    <Button
                        title="Appel externe"
                        onPress={() => this.props.navigation.navigate('External')}
                    />
                </View>
            </View>
        );
    }
}

class CurrencyScreen extends Component{
    constructor(props) {
        super(props);
        this.buttonClickListener = this.buttonClickListener.bind(this);
        this.state= {
            moneyInput: '',
            exchangeRate: 0.76
        }
    }

    buttonClickListener = () => {
        var chaine = "La valeur convertie est : \n"
        var valeur = this.state.moneyInput * this.state.exchangeRate;
        if(isNaN(valeur)) {
            Alert.alert("Format d'entrée 00.00");
        } else {
            Alert.alert(chaine + valeur)
        }
    }

    render() {
        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{height: 50}}>
                    <Text>Convertisseur de monnaies</Text>
                </View>
                <View style={{height: 50}}>
                    <TextInput
                        style={{height: 50, width: 200, borderColor: "gray", borderWidth: 3, textAlign:"center"}}
                        placeholder=" Montant en $CAN"
                        onChangeText={moneyInput => this.setState({moneyInput : moneyInput})}
                    />
                </View>
                <View style={{height: 50}}>
                    <Picker
                        selectedValue={this.state.exchangeRate}
                        style={{width: 100}}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({exchangeRate : itemValue})
                        }>
                        <Picker.Item label="USD" value="0.76"/>
                        <Picker.Item label="Euro" value="0.67"/>
                        <Picker.Item label="Peso mexicain" value="14.63"/>
                        <Picker.Item label="Bitcoin" value="0.00020"/>   
                    </Picker>
                </View>
                <View style={{height: 50, width: 200, margin: 10}}>
                    <Button
                        title="Convertir!"
                        onPress={this.buttonClickListener}
                    />
                </View>
            </View>
        );
    }
}

class ExternalScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            people: [],
            error : null

        }
    }

    async componentDidMount() {
        try {
            const response = await fetch('https://randomuser.me/api/');
            const data = await response.json();
            this.setState({people: data.results, isLoading: false})

        } catch (error) {
            this.setState({error : error.message, isLoading: false});
        }
    }
    render = () => {
        const {people, isLoading, error } = this.state;

        if(error) {
            return <View>{error}</View>
        }

        if(isLoading) {
            return <View><Text>Loading...</Text></View>;
        }

        return people.map(person => (
            <View key={person.id.value} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Image
                    style={{width: 100, height: 100, padding: 10}}
                    source={{uri : person.picture.medium}}
                />
                <View style={{height: 25}}>
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>First name : {person.name.first}</Text>
                </View>
                <View style={{height: 25}}>
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>Last name : {person.name.last}</Text>
                </View>
            </View>
        ));
    };
}

const AppNavigator = createStackNavigator({
    Home: HomeScreen,
    Currency: CurrencyScreen,
    External: ExternalScreen
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}

