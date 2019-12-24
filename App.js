import React from 'react';
import { StyleSheet, Text, View, Button, Vibration, TextInput, ScrollView } from 'react-native';

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isStudy: true, //Determines if you in a study session or a break session
      studyTime: 1500,
      breakTime: 300,
      time: 1500,
      vibButVis: false   //The visibility of the vibration button
    }
  }

  componentWillUnmount(){
    if (this.interval){
      this.stopTimer()
    }
  }

  vibrate(){
    Vibration.vibrate([500, 500, 500])
  }

  startTimer(){
    if (!this.interval){
      this.interval = setInterval(
        () => {
          if (this.state.time <= 1){
            this.state.vibButVis = true
            this.vibrate()
            clearInterval(this.interval)
            this.interval = setInterval(() => this.vibrate(), 3000)
          }
          if (this.state.time >= 1){
            this.setState({time: this.state.time - 1})
          }
        },
        1000
      )
    }
  }

  stopTimer(){
    clearInterval(this.interval)
    this.interval = null
  }

  resetTimer(){
    this.setState({isStudy: true, time: this.state.studyTime})
  }

  stopVibration(){
    if (this.state.isStudy === true){
      this.setState({isStudy: false, time: this.state.breakTime})
    }else{
      this.setState({isStudy: true, time: this.state.studyTime})
    }
    clearInterval(this.interval)
    this.interval = null
    this.state.vibButVis = false
    this.startTimer()
  }

  /**
   * Activated when one of the text fields changes
   * @param {Bool} isStudy : True: Time for Study, False: Time for Break
   * @param {Bool} isMin : True: Time in Min, False: Time in Sec
   * @param {String} text : The text that has been changed to
   */
  changeText(isStudy,isMin,text){
    this.stopTimer()
    let oldTime = (isStudy ? this.state.studyTime : this.state.breakTime)
    let time
    if (isMin){
      let numSec = oldTime % 60
      time = (Number(text) * 60) + numSec
    }else{
      let numMin = Math.floor(oldTime / 60)
      time = numMin * 60 + Number(text)
    }
    if (isStudy){
      if (this.state.isStudy){
        this.setState({
          studyTime: time,
          time: time
        })
      }else{
        this.setState({
          studyTime: time
        })
      }
    }else{
      if (!this.state.isStudy){
        this.setState({
          breakTime: time,
          time: time
        })
      }else{
        this.setState({
          breakTime: time
        })
      }
    }
  }

  timeBlock(p){
    let title = (p.isStudy ? "Study Time" : "Break Time")
    return(
    <View style={styles.timeView}>
      <Text style={styles.timeTitle}>{title}</Text>
      <View style={styles.timeBlock}>
        {this.textField({isStudy: p.isStudy, placeholder: p.min, isMin: true })}
        {this.textField({ isStudy: p.isStudy, placeholder: p.sec, isMin: false})}
      </View>
    </View>
    )        
  }

  textField(p){
    let title = (p.isMin ? "Minutes: " : "Seconds: ")
    return (
      <View style={styles.textField}>
        <Text>{title}</Text>
        <TextInput placeholder={p.placeholder} onChangeText={text => this.changeText(p.isStudy, p.isMin, text)}></TextInput>
      </View>
    )
  }

  render() {
    let minutes = Math.floor(this.state.time / 60)
    let seconds = this.state.time - (minutes * 60)
    let sMin = (Math.floor(this.state.studyTime / 60)).toString()
    let sSec = (this.state.studyTime - sMin * 60).toString()
    let bMin = (Math.floor(this.state.breakTime / 60)).toString()
    let bSec = (this.state.breakTime - bMin * 60).toString()
    let text
    if (this.state.time == 0){
      if (this.state.isStudy === true){
        text = "Time for a break!"
      }else{
        text = "Time to study"
      }
    }else{
      text = this.state.isStudy ? "Study Session" : "Break"
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.startStopButtons}>
            <Button title="Start" onPress={() => this.startTimer()}></Button>
            <Button title="Stop" onPress={() => this.stopTimer()}></Button>
            <Button title="Reset" onPress={() => this.resetTimer()}></Button>
          </View>
          {this.timeBlock({isStudy: true, min: sMin, sec: sSec})}
          {this.timeBlock({isStudy: false, min: bMin, sec: bSec})}
          <Text style={styles.timer}>{minutes} min {seconds} s</Text>
          <Text style={styles.mainText}>{text}</Text>
          {this.state.vibButVis ? <Button title="Ok" style={styles.vibrationButton} onPress={() => this.stopVibration()}></Button> : null}
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '10%'
  },
  timer:{
    fontSize: 36
  },
  mainText:{
    fontSize: 36
  },
  startStopButtons:{
    flexDirection: 'row'
  },
  timeBlock:{
    flexDirection: 'row',
  },
  timeTitle:{
    fontSize: 25
  },
  timeView:{
    alignItems: 'center',
    padding: 10
  },
  textField:{
    padding: 5,
    flexDirection: 'row'
  }
});
